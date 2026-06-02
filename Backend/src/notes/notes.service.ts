import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { User } from '../users/entities/user.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepo: Repository<Note>,
  ) {}

  async create(dto: CreateNoteDto, user: User) {
    const note = this.notesRepo.create({
      description: dto.content,
      is_completed: dto.is_completed ?? false,
      user_id: user.id,
    });

    await this.notesRepo.save(note);
    return note;
  }

  async findAll(user: User, skip: number = 0, limit: number = 5) {
    return this.notesRepo.find({
      where: {
        user_id: user.id,
        deleted_at: IsNull(),
      },
      skip,
      take: limit,
    });
  }

  async findOne(noteId: number, user: User) {
    const note = await this.notesRepo.findOne({
      where: {
        id: noteId,
        user_id: user.id,
        deleted_at: IsNull(),
      },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async update(noteId: number, dto: UpdateNoteDto, user: User) {
    const note = await this.notesRepo.findOne({ where: { id: noteId } });

    if (!note) {
      throw new NotFoundException('ID is not valid');
    }

    if (note.user_id !== user.id) {
      throw new ForbiddenException('Not authorized to update this note');
    }

    if (dto.content !== undefined) {
      note.description = dto.content;
    }
    if (dto.is_completed !== undefined) {
      note.is_completed = dto.is_completed;
    }

    await this.notesRepo.save(note);
    return note;
  }

  async remove(noteId: number, user: User) {
    const note = await this.notesRepo.findOne({
      where: { id: noteId, user_id: user.id },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    note.deleted_at = new Date();
    await this.notesRepo.save(note);

    return null;
  }
}
