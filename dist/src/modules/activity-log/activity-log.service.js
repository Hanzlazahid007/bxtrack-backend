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
exports.ActivityLogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const activity_log_entity_1 = require("./activity-log.entity");
let ActivityLogService = class ActivityLogService {
    logRepo;
    constructor(logRepo) {
        this.logRepo = logRepo;
    }
    async log(dto) {
        const entry = this.logRepo.create({
            entityType: dto.entityType,
            entityId: dto.entityId,
            action: dto.action,
            performedBy: dto.performedBy,
            organizationId: dto.organizationId,
        });
        await this.logRepo.save(entry);
    }
    async findAll(query, organizationId) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const offset = (page - 1) * limit;
        const qb = this.logRepo
            .createQueryBuilder('log')
            .leftJoin('log.performedByUser', 'performer')
            .select([
            'log.id',
            'log.entityType',
            'log.entityId',
            'log.action',
            'log.performedBy',
            'log.organizationId',
            'log.timestamp',
            'performer.id',
            'performer.name',
            'performer.email',
        ])
            .where('log.organizationId = :organizationId', { organizationId })
            .orderBy('log.timestamp', 'DESC');
        if (query.entityId) {
            qb.andWhere('log.entityId = :entityId', { entityId: query.entityId });
        }
        if (query.entityType) {
            qb.andWhere('log.entityType = :entityType', {
                entityType: query.entityType,
            });
        }
        qb.skip(offset).take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit };
    }
};
exports.ActivityLogService = ActivityLogService;
exports.ActivityLogService = ActivityLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(activity_log_entity_1.ActivityLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ActivityLogService);
//# sourceMappingURL=activity-log.service.js.map