import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ActivityLogService } from './activity-log.service';
import { ActivityLogQueryDto } from './dto/activity-log-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@ApiTags('activity-logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('activity-logs')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  @ApiOperation({ summary: 'List activity logs for the org (filterable by entityId/entityType)' })
  async findAll(
    @Query() query: ActivityLogQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.activityLogService.findAll(query, user.organizationId);
  }
}
