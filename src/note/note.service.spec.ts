import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { NoteService } from './note.service.js';

describe('NoteService', () => {
  let service: NoteService;
  const prisma = {
    note: {
      create: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoteService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<NoteService>(NoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a note for the authenticated user', async () => {
    const createNoteDto = { title: 'A note', content: 'Note content' };
    const createdNote = { id: 1, ...createNoteDto, userId: 7 };
    prisma.note.create.mockResolvedValue(createdNote);

    await expect(service.create(createNoteDto, 7)).resolves.toEqual(
      createdNote,
    );
    expect(prisma.note.create).toHaveBeenCalledWith({
      data: { ...createNoteDto, userId: 7 },
    });
  });
});
