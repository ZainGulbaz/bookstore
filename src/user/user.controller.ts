import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/user-create.dto';
import { CustomResponse } from 'src/utils/types';
import { LoginDto } from './dtos/user-login.dto';
import {Serialize} from "../interceptors/response.serialization";
import { CreateUserResponseDto } from './dtos/create-user-response.dto';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Serialize({user:CreateUserResponseDto})
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
