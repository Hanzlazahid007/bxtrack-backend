import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from './enums/user-role.enum';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a user in the org (admin only)' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 409, description: 'Email already exists in org' })
  async create(
    @Body() dto: CreateUserDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usersService.create(dto, user.organizationId);
  }

  @Get()
  @ApiOperation({ summary: 'List all users in the org' })
  async findAll(@CurrentUser() user: JwtPayload) {
    return this.usersService.findAll(user.organizationId);
  }
}
