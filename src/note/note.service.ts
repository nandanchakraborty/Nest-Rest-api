import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateNoteDto } from './dto/create-note.dto.js';
import { UpdateNoteDto } from './dto/update-note.dto.js';

@Injectable()
export class NoteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNoteDto: CreateNoteDto, userId: number) {
    const title = createNoteDto.title ?? createNoteDto.Title;
    const content = createNoteDto.content ?? createNoteDto.Content;

    return this.prisma.note.create({
      data: {
        title: title ?? '',
        content: content ?? null,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const note = await this.prisma.note.findFirst({
      where: { id, userId },
    });

    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, userId: number) {
    const existingNote = await this.prisma.note.findFirst({
      where: { id, userId },
    });

    if (!existingNote) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    const data: { title?: string; content?: string | null } = {};
    const title = updateNoteDto.title ?? updateNoteDto.Title;
    const content = updateNoteDto.content ?? updateNoteDto.Content;

    if (title !== undefined) {
      data.title = title;
    }

    if (content !== undefined) {
      data.content = content;
    }

    return this.prisma.note.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, userId: number) {
    const existingNote = await this.prisma.note.findFirst({
      where: { id, userId },
    });

    if (!existingNote) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    return this.prisma.note.delete({
      where: { id },
    });
  }
}
