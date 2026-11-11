import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { CreateNoteDto } from './dto/create-note.dto.js';
import { UpdateNoteDto } from './dto/update-note.dto.js';
import { NoteGuard } from './note.guard.js';
import { NoteService } from './note.service.js';

type AuthenticatedRequest = Request & {
  user: {
    sub: number;
  };
};

@Controller('api/note')
@UseGuards(NoteGuard)
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    const normalizedNote: CreateNoteDto = {
      title: createNoteDto.title ?? createNoteDto.Title!,
      content: createNoteDto.content ?? createNoteDto.Content!,
    };
    return this.noteService.create(normalizedNote, request.user.sub);
  }

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.noteService.findAll(request.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.noteService.findOne(+id, request.user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.noteService.update(+id, updateNoteDto, request.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.noteService.remove(+id, request.user.sub);
  }
}
