import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';
import { Customer } from '../customers/customer.entity';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ActivityAction } from '../activity-log/enums/activity-action.enum';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepo: Repository<Note>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async create(
    customerId: string,
    dto: CreateNoteDto,
    organizationId: string,
    userId: string,
  ): Promise<Note> {
    // Verify customer belongs to org
    const customer = await this.customerRepo.findOne({
      where: { id: customerId, organizationId },
      withDeleted: true,
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const note = this.noteRepo.create({
      content: dto.content,
      customerId,
      organizationId,
      createdBy: userId,
    });

    const saved = await this.noteRepo.save(note);

    await this.activityLogService.log({
      entityType: 'customer',
      entityId: customerId,
      action: ActivityAction.NOTE_ADDED,
      performedBy: userId,
      organizationId,
    });

    return saved;
  }

  async findAll(
    customerId: string,
    organizationId: string,
  ): Promise<Note[]> {
    // Verify customer belongs to org
    const customer = await this.customerRepo.findOne({
      where: { id: customerId, organizationId },
      withDeleted: true,
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return this.noteRepo
      .createQueryBuilder('note')
      .leftJoin('note.createdByUser', 'author')
      .select([
        'note.id',
        'note.content',
        'note.customerId',
        'note.organizationId',
        'note.createdBy',
        'note.createdAt',
        'author.id',
        'author.name',
        'author.email',
      ])
      .where('note.customerId = :customerId', { customerId })
      .andWhere('note.organizationId = :organizationId', { organizationId })
      .orderBy('note.createdAt', 'DESC')
      .getMany();
  }
}
