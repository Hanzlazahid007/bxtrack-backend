import { ActivityAction } from '../enums/activity-action.enum';

export interface CreateActivityLogDto {
  entityType: string;
  entityId: string;
  action: ActivityAction;
  performedBy: string;
  organizationId: string;
}
