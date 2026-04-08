import { Repository, DataSource } from 'typeorm';
import { Customer } from './customer.entity';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerQueryDto } from './dto/customer-query.dto';
import { PaginatedResponse } from '../../common/interfaces/paginated-response.interface';
export declare class CustomersService {
    private readonly customerRepo;
    private readonly activityLogService;
    private readonly dataSource;
    constructor(customerRepo: Repository<Customer>, activityLogService: ActivityLogService, dataSource: DataSource);
    create(dto: CreateCustomerDto, organizationId: string, userId: string): Promise<Customer>;
    findAll(query: CustomerQueryDto, organizationId: string): Promise<PaginatedResponse<Customer>>;
    findOne(id: string, organizationId: string): Promise<Customer>;
    update(id: string, dto: UpdateCustomerDto, organizationId: string, userId: string): Promise<Customer>;
    softDelete(id: string, organizationId: string, userId: string): Promise<{
        message: string;
    }>;
    restore(id: string, organizationId: string, userId: string): Promise<Customer>;
    assign(customerId: string, targetUserId: string, organizationId: string, performedBy: string): Promise<Customer>;
    private findOneActive;
}
