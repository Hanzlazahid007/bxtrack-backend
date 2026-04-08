import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    create(customerId: string, dto: CreateNoteDto, user: JwtPayload): Promise<import("./note.entity").Note>;
    findAll(customerId: string, user: JwtPayload): Promise<import("./note.entity").Note[]>;
}
