import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignCustomerDto {
  @ApiProperty({ example: 'uuid-of-user' })
  @IsUUID()
  userId: string;
}
