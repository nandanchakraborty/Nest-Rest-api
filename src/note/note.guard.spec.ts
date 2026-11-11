import { ExecutionContext, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { NoteGuard } from './note.guard.js';

describe('NoteGuard', () => {
  let guard: NoteGuard;
  const jwtService = {
    verifyAsync: vi.fn(),
  };
  const prisma = {
    note: {
      findFirst: vi.fn(),
    },
  };

  beforeEach(async () => {
    jwtService.verifyAsync.mockResolvedValue({ sub: 7 });
    prisma.note.findFirst.mockResolvedValue({ id: 3 });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteGuard,
        { provide: JwtService, useValue: jwtService },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    guard = module.get<NoteGuard>(NoteGuard);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('allows an owner to access their note', async () => {
    await expect(guard.canActivate(createContext('3'))).resolves.toBe(true);
    expect(prisma.note.findFirst).toHaveBeenCalledWith({
      where: { id: 3, userId: 7 },
      select: { id: true },
    });
  });

  it('denies access when the note does not belong to the user', async () => {
    prisma.note.findFirst.mockResolvedValue(null);

    await expect(guard.canActivate(createContext('3'))).rejects.toThrow(
      NotFoundException,
    );
  });

  it('authenticates routes without a note id without looking up a note', async () => {
    await expect(guard.canActivate(createContext())).resolves.toBe(true);
    expect(prisma.note.findFirst).not.toHaveBeenCalled();
  });
});

function createContext(id?: string): ExecutionContext {
  const request = {
    headers: { authorization: 'Bearer test-token' },
    params: id === undefined ? {} : { id },
  };

  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;
}
