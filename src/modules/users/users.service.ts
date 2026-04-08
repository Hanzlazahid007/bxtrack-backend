import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto, organizationId: string): Promise<User> {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email, organizationId },
    });

    if (existing) {
      throw new ConflictException(
        'A user with this email already exists in this organization',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
      organizationId,
    });

    return this.userRepo.save(user);
  }

  async findAll(organizationId: string): Promise<Omit<User, 'password'>[]> {
    return this.userRepo
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.role',
        'user.organizationId',
        'user.createdAt',
      ])
      .where('user.organizationId = :organizationId', { organizationId })
      .orderBy('user.createdAt', 'DESC')
      .getMany();
  }

  async findOneInOrg(id: string, organizationId: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id, organizationId },
    });
    if (!user) {
      throw new NotFoundException('User not found in this organization');
    }
    return user;
  }
}
