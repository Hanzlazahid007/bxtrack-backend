import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './activity-log.entity';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { ActivityLogQueryDto } from './dto/activity-log-query.dto';
import { PaginatedResponse } from '../../common/interfaces/paginated-response.interface';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly logRepo: Repository<ActivityLog>,
  ) {}

  async log(dto: CreateActivityLogDto): Promise<void> {
    const entry = this.logRepo.create({
      entityType: dto.entityType,
      entityId: dto.entityId,
      action: dto.action,
      performedBy: dto.performedBy,
      organizationId: dto.organizationId,
    });
    await this.logRepo.save(entry);
  }

  async findAll(
    query: ActivityLogQueryDto,
    organizationId: string,
  ): Promise<PaginatedResponse<ActivityLog>> {
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
}
