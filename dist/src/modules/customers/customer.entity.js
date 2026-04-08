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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const organization_entity_1 = require("../organizations/organization.entity");
const user_entity_1 = require("../users/user.entity");
let Customer = class Customer {
    id;
    name;
    email;
    phone;
    organizationId;
    organization;
    assignedTo;
    assignedUser;
    createdAt;
    updatedAt;
    deletedAt;
};
exports.Customer = Customer;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Customer.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Customer.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Customer.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Customer.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organization_entity_1.Organization),
    (0, typeorm_1.JoinColumn)({ name: 'organizationId' }),
    __metadata("design:type", organization_entity_1.Organization)
], Customer.prototype, "organization", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Customer.prototype, "assignedTo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assignedTo' }),
    __metadata("design:type", Object)
], Customer.prototype, "assignedUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Customer.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Customer.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Object)
], Customer.prototype, "deletedAt", void 0);
exports.Customer = Customer = __decorate([
    (0, typeorm_1.Entity)('customers'),
    (0, typeorm_1.Index)(['organizationId', 'deletedAt']),
    (0, typeorm_1.Index)(['organizationId', 'assignedTo']),
    (0, typeorm_1.Index)(['name', 'email'])
], Customer);
//# sourceMappingURL=customer.entity.js.map