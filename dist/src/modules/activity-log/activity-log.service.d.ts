import { Repository } from 'typeorm';
import { ActivityLog } from './activity-log.entity';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { ActivityLogQueryDto } from './dto/activity-log-query.dto';
import { PaginatedResponse } from '../../common/interfaces/paginated-response.interface';
export declare class ActivityLogService {
    private readonly logRepo;
    constructor(logRepo: Repository<ActivityLog>);
    log(dto: CreateActivityLogDto): Promise<void>;
    findAll(query: ActivityLogQueryDto, organizationId: string): Promise<PaginatedResponse<ActivityLog>>;
}
