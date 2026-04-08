"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
const activity_log_service_1 = require("../activity-log/activity-log.service");
const activity_action_enum_1 = require("../activity-log/enums/activity-action.enum");
let CustomersService = class CustomersService {
    customerRepo;
    activityLogService;
    dataSource;
    constructor(customerRepo, activityLogService, dataSource) {
        this.customerRepo = customerRepo;
        this.activityLogService = activityLogService;
        this.dataSource = dataSource;
    }
    async create(dto, organizationId, userId) {
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
            action: activity_action_enum_1.ActivityAction.CUSTOMER_CREATED,
            performedBy: userId,
            organizationId,
        });
        return saved;
    }
    async findAll(query, organizationId) {
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
            qb.andWhere('(customer.name ILIKE :search OR customer.email ILIKE :search)', { search: `%${query.search}%` });
        }
        qb.orderBy('customer.createdAt', 'DESC')
            .skip(offset)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit };
    }
    async findOne(id, organizationId) {
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
            throw new common_1.NotFoundException('Customer not found');
        }
        return customer;
    }
    async update(id, dto, organizationId, userId) {
        const customer = await this.findOneActive(id, organizationId);
        Object.assign(customer, dto);
        const saved = await this.customerRepo.save(customer);
        await this.activityLogService.log({
            entityType: 'customer',
            entityId: id,
            action: activity_action_enum_1.ActivityAction.CUSTOMER_UPDATED,
            performedBy: userId,
            organizationId,
        });
        return saved;
    }
    async softDelete(id, organizationId, userId) {
        const customer = await this.findOneActive(id, organizationId);
        await this.customerRepo.softDelete(customer.id);
        await this.activityLogService.log({
            entityType: 'customer',
            entityId: id,
            action: activity_action_enum_1.ActivityAction.CUSTOMER_DELETED,
            performedBy: userId,
            organizationId,
        });
        return { message: 'Customer deleted successfully' };
    }
    async restore(id, organizationId, userId) {
        const customer = await this.customerRepo.findOne({
            where: { id, organizationId },
            withDeleted: true,
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        if (!customer.deletedAt) {
            throw new common_1.BadRequestException('Customer is not deleted');
        }
        await this.customerRepo.restore(id);
        await this.activityLogService.log({
            entityType: 'customer',
            entityId: id,
            action: activity_action_enum_1.ActivityAction.CUSTOMER_RESTORED,
            performedBy: userId,
            organizationId,
        });
        return this.findOne(id, organizationId);
    }
    async assign(customerId, targetUserId, organizationId, performedBy) {
        return this.dataSource.transaction(async (manager) => {
            const assignedCustomers = await manager
                .createQueryBuilder(customer_entity_1.Customer, 'customer')
                .select(['customer.id'])
                .where('customer.assignedTo = :targetUserId', { targetUserId })
                .andWhere('customer.organizationId = :organizationId', {
                organizationId,
            })
                .andWhere('customer.deletedAt IS NULL')
                .setLock('pessimistic_write')
                .getMany();
            if (assignedCustomers.length >= 5) {
                throw new common_1.ConflictException('User already has 5 active customers assigned');
            }
            const customer = await manager.findOne(customer_entity_1.Customer, {
                where: { id: customerId, organizationId },
            });
            if (!customer) {
                throw new common_1.NotFoundException('Customer not found');
            }
            if (customer.deletedAt) {
                throw new common_1.BadRequestException('Cannot assign a deleted customer');
            }
            customer.assignedTo = targetUserId;
            const saved = await manager.save(customer_entity_1.Customer, customer);
            await this.activityLogService.log({
                entityType: 'customer',
                entityId: customerId,
                action: activity_action_enum_1.ActivityAction.CUSTOMER_ASSIGNED,
                performedBy,
                organizationId,
            });
            return saved;
        });
    }
    async findOneActive(id, organizationId) {
        const customer = await this.customerRepo.findOne({
            where: { id, organizationId, deletedAt: (0, typeorm_2.IsNull)() },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found or has been deleted');
        }
        return customer;
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        activity_log_service_1.ActivityLogService,
        typeorm_2.DataSource])
], CustomersService);
//# sourceMappingURL=customers.service.js.map