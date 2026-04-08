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
exports.ActivityLogController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const activity_log_service_1 = require("./activity-log.service");
const activity_log_query_dto_1 = require("./dto/activity-log-query.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let ActivityLogController = class ActivityLogController {
    activityLogService;
    constructor(activityLogService) {
        this.activityLogService = activityLogService;
    }
    async findAll(query, user) {
        return this.activityLogService.findAll(query, user.organizationId);
    }
};
exports.ActivityLogController = ActivityLogController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List activity logs for the org (filterable by entityId/entityType)' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [activity_log_query_dto_1.ActivityLogQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "findAll", null);
exports.ActivityLogController = ActivityLogController = __decorate([
    (0, swagger_1.ApiTags)('activity-logs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('activity-logs'),
    __metadata("design:paramtypes", [activity_log_service_1.ActivityLogService])
], ActivityLogController);
//# sourceMappingURL=activity-log.controller.js.map