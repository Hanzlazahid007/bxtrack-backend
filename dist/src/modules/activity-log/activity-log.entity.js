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
exports.ActivityLog = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const organization_entity_1 = require("../organizations/organization.entity");
const user_entity_1 = require("../users/user.entity");
const activity_action_enum_1 = require("./enums/activity-action.enum");
let ActivityLog = class ActivityLog {
    id;
    entityType;
    entityId;
    action;
    performedBy;
    performedByUser;
    organizationId;
    organization;
    timestamp;
};
exports.ActivityLog = ActivityLog;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ActivityLog.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], ActivityLog.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ActivityLog.prototype, "entityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: activity_action_enum_1.ActivityAction }),
    (0, typeorm_1.Column)({ type: 'enum', enum: activity_action_enum_1.ActivityAction }),
    __metadata("design:type", String)
], ActivityLog.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ActivityLog.prototype, "performedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'performedBy' }),
    __metadata("design:type", user_entity_1.User)
], ActivityLog.prototype, "performedByUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ActivityLog.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organization_entity_1.Organization),
    (0, typeorm_1.JoinColumn)({ name: 'organizationId' }),
    __metadata("design:type", organization_entity_1.Organization)
], ActivityLog.prototype, "organization", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ActivityLog.prototype, "timestamp", void 0);
exports.ActivityLog = ActivityLog = __decorate([
    (0, typeorm_1.Entity)('activity_logs'),
    (0, typeorm_1.Index)(['entityId', 'entityType']),
    (0, typeorm_1.Index)(['organizationId'])
], ActivityLog);
//# sourceMappingURL=activity-log.entity.js.map