import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { UserService } from '../user/user.service.js';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService){

    }
    register(registerDto:RegisterDto){
      const user =   this.userService.getUserByEmail(registerDto.email);
        return user;
    }
}
