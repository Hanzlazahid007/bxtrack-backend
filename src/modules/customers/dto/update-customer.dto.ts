import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCustomerDto {
  @ApiPropertyOptional({ example: 'Alice Johnson' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'alice@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+1-555-0100' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'uuid-of-user' })
  @IsOptional()
  @IsUUID()
  assignedTo?: string;
}
