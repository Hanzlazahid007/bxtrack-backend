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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customers_service_1 = require("./customers.service");
const create_customer_dto_1 = require("./dto/create-customer.dto");
const update_customer_dto_1 = require("./dto/update-customer.dto");
const assign_customer_dto_1 = require("./dto/assign-customer.dto");
const customer_query_dto_1 = require("./dto/customer-query.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let CustomersController = class CustomersController {
    customersService;
    constructor(customersService) {
        this.customersService = customersService;
    }
    async create(dto, user) {
        return this.customersService.create(dto, user.organizationId, user.sub);
    }
    async findAll(query, user) {
        return this.customersService.findAll(query, user.organizationId);
    }
    async findOne(id, user) {
        return this.customersService.findOne(id, user.organizationId);
    }
    async update(id, dto, user) {
        return this.customersService.update(id, dto, user.organizationId, user.sub);
    }
    async remove(id, user) {
        return this.customersService.softDelete(id, user.organizationId, user.sub);
    }
    async restore(id, user) {
        return this.customersService.restore(id, user.organizationId, user.sub);
    }
    async assign(id, dto, user) {
        return this.customersService.assign(id, dto.userId, user.organizationId, user.sub);
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a customer' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Customer created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_dto_1.CreateCustomerDto, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List customers (paginated + searchable)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_query_dto_1.CustomerQueryDto, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update customer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer updated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_customer_dto_1.UpdateCustomerDto, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete customer' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/restore'),
    (0, swagger_1.ApiOperation)({ summary: 'Restore a soft-deleted customer' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "restore", null);
__decorate([
    (0, common_1.Post)(':id/assign'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign customer to a user (max 5 per user)' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User already has 5 active customers' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_customer_dto_1.AssignCustomerDto, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "assign", null);
exports.CustomersController = CustomersController = __decorate([
    (0, swagger_1.ApiTags)('customers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('customers'),
    __metadata("design:paramtypes", [customers_service_1.CustomersService])
], CustomersController);
//# sourceMappingURL=customers.controller.js.map