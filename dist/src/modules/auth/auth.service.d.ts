import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Organization } from '../organizations/organization.entity';
import { User } from '../users/user.entity';
import { UserRole } from '../users/enums/user-role.enum';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly orgRepo;
    private readonly userRepo;
    private readonly jwtService;
    private readonly dataSource;
    constructor(orgRepo: Repository<Organization>, userRepo: Repository<User>, jwtService: JwtService, dataSource: DataSource);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        userId: string;
        organizationId: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        userId: string;
        organizationId: string;
        role: UserRole;
    }>;
}
