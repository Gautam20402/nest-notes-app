import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { User } from 'src/users/entities/user.entity';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateNoteDto, @Request() req) {
    return this.notesService.create(dto, req.user as User);
  }

  @Get('allnotes')
  @HttpCode(HttpStatus.OK)
  findAll(
    @Request() req,
    @Query('skip') skip: number = 0,
    @Query('limit') limit: number = 5,
  ) {
    return this.notesService.findAll(req.user, Number(skip), Number(limit));
  }

  @Get(':note_id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('note_id', ParseIntPipe) noteId: number, @Request() req) {
    return this.notesService.findOne(noteId, req.user);
  }

  @Put('update/:note_id')
  @HttpCode(HttpStatus.CREATED)
  update(
    @Param('note_id', ParseIntPipe) noteId: number,
    @Body() dto: UpdateNoteDto,
    @Request() req,
  ) {
    return this.notesService.update(noteId, dto, req.user);
  }

  @Delete('delete/:note_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('note_id', ParseIntPipe) noteId: number, @Request() req) {
    return this.notesService.remove(noteId, req.user);
  }
}
