import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        userId: string;
        organizationId: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        userId: string;
        organizationId: string;
        role: import("../users/enums/user-role.enum").UserRole;
    }>;
}
