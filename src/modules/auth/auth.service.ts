import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Organization } from '../organizations/organization.entity';
import { User } from '../users/user.entity';
import { UserRole } from '../users/enums/user-role.enum';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async register(
    dto: RegisterDto,
  ): Promise<{ accessToken: string; userId: string; organizationId: string }> {
    return this.dataSource.transaction(async (manager) => {
      // Check if email already exists globally (org is new so no conflict possible,
      // but guard against duplicate registration calls)
      const existingUser = await manager.findOne(User, {
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new ConflictException(
          'A user with this email already exists',
        );
      }

      // Create organization
      const organization = manager.create(Organization, {
        name: dto.organizationName,
      });
      const savedOrg = await manager.save(organization);

      // Hash password
      const hashedPassword = await bcrypt.hash(dto.password, 12);

      // Create admin user
      const user = manager.create(User, {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
        organizationId: savedOrg.id,
      });
      const savedUser = await manager.save(user);

      const payload: JwtPayload = {
        sub: savedUser.id,
        email: savedUser.email,
        organizationId: savedOrg.id,
        role: savedUser.role,
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken,
        userId: savedUser.id,
        organizationId: savedOrg.id,
      };
    });
  }

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; userId: string; organizationId: string; role: UserRole }> {
    // Include password field explicitly (select: false on entity)
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: dto.email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      organizationId: user.organizationId,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
    };
  }
}
