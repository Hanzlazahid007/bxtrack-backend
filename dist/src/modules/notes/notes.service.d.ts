import { Repository } from 'typeorm';
import { Note } from './note.entity';
import { Customer } from '../customers/customer.entity';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { CreateNoteDto } from './dto/create-note.dto';
export declare class NotesService {
    private readonly noteRepo;
    private readonly customerRepo;
    private readonly activityLogService;
    constructor(noteRepo: Repository<Note>, customerRepo: Repository<Customer>, activityLogService: ActivityLogService);
    create(customerId: string, dto: CreateNoteDto, organizationId: string, userId: string): Promise<Note>;
    findAll(customerId: string, organizationId: string): Promise<Note[]>;
}
