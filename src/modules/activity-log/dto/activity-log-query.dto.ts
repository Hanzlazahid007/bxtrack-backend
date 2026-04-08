import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ActivityLogQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiPropertyOptional({ example: 'customer' })
  @IsOptional()
  @IsString()
  entityType?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
