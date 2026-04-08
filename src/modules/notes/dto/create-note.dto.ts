import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({ example: 'Spoke to customer about upgrade.' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
