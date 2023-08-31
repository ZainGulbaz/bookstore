import { Controller,Post,Body,Res,HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/user-create.dto';
import {Response} from "express";
import { CustomResponse } from 'src/utils/types';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}
    @Post()
    async createUser(@Body() body:CreateUserDto):Promise<CustomResponse>{
       let serviceResponse= await this.userService.create(body);
       return serviceResponse;
    }
}
