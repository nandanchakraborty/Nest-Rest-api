import { Test, TestingModule } from '@nestjs/testing';
import { validate } from 'class-validator';
import type { Request } from 'express';
import { CreateNoteDto } from './dto/create-note.dto.js';
import { NoteController } from './note.controller.js';
import { NoteGuard } from './note.guard.js';
import { NoteService } from './note.service.js';

describe('NoteController', () => {
  let controller: NoteController;
  const noteService = {
    create: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoteController],
      providers: [{ provide: NoteService, useValue: noteService }],
    })
      .overrideGuard(NoteGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<NoteController>(NoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('passes the authenticated user ID with the note data', async () => {
    const request = { user: { sub: 7 } } as Request & {
      user: { sub: number };
    };
    const createNoteDto = { title: 'A note', content: 'Note content' };
    const createdNote = { id: 1, ...createNoteDto, userId: 7 };
    noteService.create.mockResolvedValue(createdNote);

    await expect(controller.create(request, createNoteDto)).resolves.toEqual(
      createdNote,
    );
    expect(noteService.create).toHaveBeenCalledWith(createNoteDto, 7);
  });

  it('normalizes uppercase note fields before calling the service', async () => {
    const request = { user: { sub: 7 } } as Request & {
      user: { sub: number };
    };
    const createNoteDto = {
      Title: 'A note',
      Content: 'Note content',
    } as CreateNoteDto;

    await controller.create(request, createNoteDto);

    expect(noteService.create).toHaveBeenCalledWith(
      { title: 'A note', content: 'Note content' },
      7,
    );
  });

  it('validates lowercase and uppercase note fields', async () => {
    const lowercaseDto = Object.assign(new CreateNoteDto(), {
      title: 'A note',
      content: 'Note content',
    });
    const uppercaseDto = Object.assign(new CreateNoteDto(), {
      Title: 'A note',
      Content: 'Note content',
    });

    await expect(validate(lowercaseDto)).resolves.toHaveLength(0);
    await expect(validate(uppercaseDto)).resolves.toHaveLength(0);
  });
});
