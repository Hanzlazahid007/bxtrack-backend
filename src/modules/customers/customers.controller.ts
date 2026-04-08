import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AssignCustomerDto } from './dto/assign-customer.dto';
import { CustomerQueryDto } from './dto/customer-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@ApiTags('customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a customer' })
  @ApiResponse({ status: 201, description: 'Customer created' })
  async create(
    @Body() dto: CreateCustomerDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.customersService.create(dto, user.organizationId, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List customers (paginated + searchable)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @Query() query: CustomerQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.customersService.findAll(query, user.organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.customersService.findOne(id, user.organizationId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update customer' })
  @ApiResponse({ status: 200, description: 'Customer updated' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.customersService.update(
      id,
      dto,
      user.organizationId,
      user.sub,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete customer' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.customersService.softDelete(
      id,
      user.organizationId,
      user.sub,
    );
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted customer' })
  async restore(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.customersService.restore(id, user.organizationId, user.sub);
  }

  @Post(':id/assign')
  @ApiOperation({ summary: 'Assign customer to a user (max 5 per user)' })
  @ApiResponse({ status: 409, description: 'User already has 5 active customers' })
  async assign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignCustomerDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.customersService.assign(
      id,
      dto.userId,
      user.organizationId,
      user.sub,
    );
  }
}
