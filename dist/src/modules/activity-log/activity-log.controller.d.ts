import { ActivityLogService } from './activity-log.service';
import { ActivityLogQueryDto } from './dto/activity-log-query.dto';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
export declare class ActivityLogController {
    private readonly activityLogService;
    constructor(activityLogService: ActivityLogService);
    findAll(query: ActivityLogQueryDto, user: JwtPayload): Promise<import("../../common/interfaces/paginated-response.interface").PaginatedResponse<import("./activity-log.entity").ActivityLog>>;
}
