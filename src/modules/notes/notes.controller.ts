import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@ApiTags('notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers/:customerId/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Add a note to a customer' })
  @ApiResponse({ status: 201, description: 'Note created' })
  async create(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Body() dto: CreateNoteDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.notesService.create(
      customerId,
      dto,
      user.organizationId,
      user.sub,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List notes for a customer' })
  async findAll(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.notesService.findAll(customerId, user.organizationId);
  }
}
