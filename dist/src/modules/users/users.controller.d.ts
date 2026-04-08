import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto, user: JwtPayload): Promise<import("./user.entity").User>;
    findAll(user: JwtPayload): Promise<Omit<import("./user.entity").User, "password">[]>;
}
