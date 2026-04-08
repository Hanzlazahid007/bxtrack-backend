import { Organization } from '../organizations/organization.entity';
import { User } from '../users/user.entity';
import { ActivityAction } from './enums/activity-action.enum';
export declare class ActivityLog {
    id: string;
    entityType: string;
    entityId: string;
    action: ActivityAction;
    performedBy: string;
    performedByUser: User;
    organizationId: string;
    organization: Organization;
    timestamp: Date;
}
