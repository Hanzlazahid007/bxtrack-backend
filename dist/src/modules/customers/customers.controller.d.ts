import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AssignCustomerDto } from './dto/assign-customer.dto';
import { CustomerQueryDto } from './dto/customer-query.dto';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(dto: CreateCustomerDto, user: JwtPayload): Promise<import("./customer.entity").Customer>;
    findAll(query: CustomerQueryDto, user: JwtPayload): Promise<import("../../common/interfaces/paginated-response.interface").PaginatedResponse<import("./customer.entity").Customer>>;
    findOne(id: string, user: JwtPayload): Promise<import("./customer.entity").Customer>;
    update(id: string, dto: UpdateCustomerDto, user: JwtPayload): Promise<import("./customer.entity").Customer>;
    remove(id: string, user: JwtPayload): Promise<{
        message: string;
    }>;
    restore(id: string, user: JwtPayload): Promise<import("./customer.entity").Customer>;
    assign(id: string, dto: AssignCustomerDto, user: JwtPayload): Promise<import("./customer.entity").Customer>;
}
