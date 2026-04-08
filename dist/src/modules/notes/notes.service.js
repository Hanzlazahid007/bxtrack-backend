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
exports.NotesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const note_entity_1 = require("./note.entity");
const customer_entity_1 = require("../customers/customer.entity");
const activity_log_service_1 = require("../activity-log/activity-log.service");
const activity_action_enum_1 = require("../activity-log/enums/activity-action.enum");
let NotesService = class NotesService {
    noteRepo;
    customerRepo;
    activityLogService;
    constructor(noteRepo, customerRepo, activityLogService) {
        this.noteRepo = noteRepo;
        this.customerRepo = customerRepo;
        this.activityLogService = activityLogService;
    }
    async create(customerId, dto, organizationId, userId) {
        const customer = await this.customerRepo.findOne({
            where: { id: customerId, organizationId },
            withDeleted: true,
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        const note = this.noteRepo.create({
            content: dto.content,
            customerId,
            organizationId,
            createdBy: userId,
        });
        const saved = await this.noteRepo.save(note);
        await this.activityLogService.log({
            entityType: 'customer',
            entityId: customerId,
            action: activity_action_enum_1.ActivityAction.NOTE_ADDED,
            performedBy: userId,
            organizationId,
        });
        return saved;
    }
    async findAll(customerId, organizationId) {
        const customer = await this.customerRepo.findOne({
            where: { id: customerId, organizationId },
            withDeleted: true,
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        return this.noteRepo
            .createQueryBuilder('note')
            .leftJoin('note.createdByUser', 'author')
            .select([
            'note.id',
            'note.content',
            'note.customerId',
            'note.organizationId',
            'note.createdBy',
            'note.createdAt',
            'author.id',
            'author.name',
            'author.email',
        ])
            .where('note.customerId = :customerId', { customerId })
            .andWhere('note.organizationId = :organizationId', { organizationId })
            .orderBy('note.createdAt', 'DESC')
            .getMany();
    }
};
exports.NotesService = NotesService;
exports.NotesService = NotesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(note_entity_1.Note)),
    __param(1, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        activity_log_service_1.ActivityLogService])
], NotesService);
//# sourceMappingURL=notes.service.js.map