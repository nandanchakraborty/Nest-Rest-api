import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthGuard } from '../auth/auth.guard.js';

type AuthenticatedRequest = Request & {
  user: {
    sub: unknown;
  };
};

@Injectable()
export class NoteGuard extends AuthGuard {
  constructor(
    jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {
    super(jwtService);
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user.sub;

    if (
      typeof userId !== 'number' ||
      !Number.isSafeInteger(userId) ||
      userId <= 0
    ) {
      throw new UnauthorizedException('Invalid user in token');
    }

    const rawNoteId = request.params.id;
    if (rawNoteId === undefined) {
      return true;
    }

    if (typeof rawNoteId !== 'string' || !/^[1-9]\d*$/.test(rawNoteId)) {
      throw new BadRequestException('Invalid note id');
    }

    const noteId = Number(rawNoteId);
    if (!Number.isSafeInteger(noteId)) {
      throw new BadRequestException('Invalid note id');
    }

    const note = await this.prisma.note.findFirst({
      where: { id: noteId, userId },
      select: { id: true },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return true;
  }
}
