import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserService } from '../user/user.service.js';
import { LoginDto } from './dto/loginDto.js';
import { RegisterDto } from './dto/register.dto.js';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerDto: RegisterDto) {
    const user = await this.userService.getUserByEmail(registerDto.email);
    if (user) {
      throw new ConflictException('User with this email already exist');
    }
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRound);
    const newUser = this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
    });
    const payload = { sub: (await newUser).id, email: (await newUser).email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };

  }
  async login(loginDto: LoginDto) {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Email or password not matched');
    }
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email or password not matched');
    }
     const payload = { sub: (await user).id, email: (await user).email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };

  }
}
