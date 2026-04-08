import { Organization } from '../organizations/organization.entity';
import { UserRole } from './enums/user-role.enum';
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    organizationId: string;
    organization: Organization;
    createdAt: Date;
}
