import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { NoteService } from './note.service.js';
import { NoteController } from './note.controller.js';
import { NoteGuard } from './note.guard.js';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [NoteController],
  providers: [NoteService, NoteGuard],
})
export class NoteModule {}
