import { Organization } from '../organizations/organization.entity';
import { User } from '../users/user.entity';
import { Customer } from '../customers/customer.entity';
export declare class Note {
    id: string;
    content: string;
    customerId: string;
    customer: Customer;
    organizationId: string;
    organization: Organization;
    createdBy: string;
    createdByUser: User;
    createdAt: Date;
}
