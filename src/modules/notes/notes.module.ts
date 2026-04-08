import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { Note } from './note.entity';
import { Customer } from '../customers/customer.entity';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note, Customer]),
    ActivityLogModule,
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
