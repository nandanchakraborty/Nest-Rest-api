import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from '../auth/dto/register.dto.js';
import { LoginDto } from '../auth/dto/loginDto.js';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByEmail(email: string) {
    const user =  await this.prisma.user.findFirst({ where: { email } });
    return user;
  }


    async createUser(registerDto:RegisterDto){
        return await this.prisma.user.create({data:registerDto});
    }

}
