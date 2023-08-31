import { Controller, Post, Body, Res, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/user-create.dto';
import { CustomResponse } from 'src/utils/types';
import { LoginDto } from './dtos/user-login.dto';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}
  @Post('auth/signup')
  async createUser(@Body() body: CreateUserDto): Promise<CustomResponse> {
    let serviceResponse = await this.userService.create(body);
    return serviceResponse;
  }

  @Post('auth/login')
  async signIn(@Body() body: LoginDto) {
    return await this.userService.login(body);
  }
}
