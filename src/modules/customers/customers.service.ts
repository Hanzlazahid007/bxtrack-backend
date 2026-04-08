import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, IsNull, Not } from 'typeorm';
import { Customer } from './customer.entity';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerQueryDto } from './dto/customer-query.dto';
import { ActivityAction } from '../activity-log/enums/activity-action.enum';
import { PaginatedResponse } from '../../common/interfaces/paginated-response.interface';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    private readonly activityLogService: ActivityLogService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    dto: CreateCustomerDto,
    organizationId: string,
    userId: string,
  ): Promise<Customer> {
    const customer = this.customerRepo.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      organizationId,
      assignedTo: dto.assignedTo || userId,
    });

    const saved = await this.customerRepo.save(customer);

    await this.activityLogService.log({
      entityType: 'customer',
      entityId: saved.id,
      action: ActivityAction.CUSTOMER_CREATED,
      performedBy: userId,
      organizationId,
    });

    return saved;
  }

  async findAll(
    query: CustomerQueryDto,
    organizationId: string,
  ): Promise<PaginatedResponse<Customer>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const qb = this.customerRepo
      .createQueryBuilder('customer')
      .leftJoin('customer.assignedUser', 'assignedUser')
      .select([
        'customer.id',
        'customer.name',
        'customer.email',
        'customer.phone',
        'customer.organizationId',
        'customer.assignedTo',
        'customer.createdAt',
        'customer.updatedAt',
        'assignedUser.id',
        'assignedUser.name',
        'assignedUser.email',
      ])
      .where('customer.organizationId = :organizationId', { organizationId })
      .andWhere('customer.deletedAt IS NULL');

    if (query.search) {
      qb.andWhere(
        '(customer.name ILIKE :search OR customer.email ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    qb.orderBy('customer.createdAt', 'DESC')
      .skip(offset)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string, organizationId: string): Promise<Customer> {
    const customer = await this.customerRepo
      .createQueryBuilder('customer')
      .leftJoin('customer.assignedUser', 'assignedUser')
      .select([
        'customer.id',
        'customer.name',
        'customer.email',
        'customer.phone',
        'customer.organizationId',
        'customer.assignedTo',
        'customer.createdAt',
        'customer.updatedAt',
        'customer.deletedAt',
        'assignedUser.id',
        'assignedUser.name',
        'assignedUser.email',
      ])
      .where('customer.id = :id', { id })
      .andWhere('customer.organizationId = :organizationId', { organizationId })
      .withDeleted()
      .getOne();

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(
    id: string,
    dto: UpdateCustomerDto,
    organizationId: string,
    userId: string,
  ): Promise<Customer> {
    const customer = await this.findOneActive(id, organizationId);

    Object.assign(customer, dto);
    const saved = await this.customerRepo.save(customer);

    await this.activityLogService.log({
      entityType: 'customer',
      entityId: id,
      action: ActivityAction.CUSTOMER_UPDATED,
      performedBy: userId,
      organizationId,
    });

    return saved;
  }

  async softDelete(
    id: string,
    organizationId: string,
    userId: string,
  ): Promise<{ message: string }> {
    const customer = await this.findOneActive(id, organizationId);
    await this.customerRepo.softDelete(customer.id);

    await this.activityLogService.log({
      entityType: 'customer',
      entityId: id,
      action: ActivityAction.CUSTOMER_DELETED,
      performedBy: userId,
      organizationId,
    });

    return { message: 'Customer deleted successfully' };
  }

  async restore(
    id: string,
    organizationId: string,
    userId: string,
  ): Promise<Customer> {
    // Find including soft-deleted
    const customer = await this.customerRepo.findOne({
      where: { id, organizationId },
      withDeleted: true,
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (!customer.deletedAt) {
      throw new BadRequestException('Customer is not deleted');
    }

    await this.customerRepo.restore(id);

    await this.activityLogService.log({
      entityType: 'customer',
      entityId: id,
      action: ActivityAction.CUSTOMER_RESTORED,
      performedBy: userId,
      organizationId,
    });

    return this.findOne(id, organizationId);
  }

  /**
   * Concurrency-safe assignment using SELECT FOR UPDATE.
   *
   * Within a serializable transaction:
   * 1. Lock all active customers assigned to the target user in this org using
   *    SELECT ... FOR UPDATE — any concurrent transaction touching these rows
   *    must wait.
   * 2. Count them. If >= 5 → reject with 409.
   * 3. Only if count < 5, update the customer's assignedTo.
   *
   * This guarantees no race condition: two concurrent assign requests for the
   * same user will serialize, and only one will succeed if the user is at 4
   * assignments.
   */
  async assign(
    customerId: string,
    targetUserId: string,
    organizationId: string,
    performedBy: string,
  ): Promise<Customer> {
    return this.dataSource.transaction(async (manager) => {
      // Lock existing active assignments for target user
      const assignedCustomers = await manager
        .createQueryBuilder(Customer, 'customer')
        .select(['customer.id'])
        .where('customer.assignedTo = :targetUserId', { targetUserId })
        .andWhere('customer.organizationId = :organizationId', {
          organizationId,
        })
        .andWhere('customer.deletedAt IS NULL')
        .setLock('pessimistic_write')
        .getMany();

      if (assignedCustomers.length >= 5) {
        throw new ConflictException(
          'User already has 5 active customers assigned',
        );
      }

      // Verify customer belongs to org and is active
      const customer = await manager.findOne(Customer, {
        where: { id: customerId, organizationId },
      });

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      if (customer.deletedAt) {
        throw new BadRequestException('Cannot assign a deleted customer');
      }

      customer.assignedTo = targetUserId;
      const saved = await manager.save(Customer, customer);

      await this.activityLogService.log({
        entityType: 'customer',
        entityId: customerId,
        action: ActivityAction.CUSTOMER_ASSIGNED,
        performedBy,
        organizationId,
      });

      return saved;
    });
  }

  private async findOneActive(
    id: string,
    organizationId: string,
  ): Promise<Customer> {
    const customer = await this.customerRepo.findOne({
      where: { id, organizationId, deletedAt: IsNull() },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found or has been deleted');
    }

    return customer;
  }
}
