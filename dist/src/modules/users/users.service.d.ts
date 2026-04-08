import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    create(dto: CreateUserDto, organizationId: string): Promise<User>;
    findAll(organizationId: string): Promise<Omit<User, 'password'>[]>;
    findOneInOrg(id: string, organizationId: string): Promise<User>;
}
