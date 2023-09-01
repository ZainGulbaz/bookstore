import { Injectable,HttpStatus,BadRequestException,UnauthorizedException} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dtos/user-create.dto';
import { CustomResponse } from 'src/utils/types';
import Strings from 'src/utils/Strings';
import { ErrorCodes } from 'src/utils/Constatns';
import { errorGenerator, validatePassword } from 'src/utils/Commons';
import * as bcrypt from "bcrypt";
import { LoginDto } from './dtos/user-login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService,private jwtService:JwtService) {}


  async create(data: CreateUserDto):Promise<CustomResponse> {
    
    let responsePayload:CustomResponse={
        data:{},
        message:[],
        statusCode:HttpStatus.AMBIGUOUS,
    }
    
    try{        
        let passwordHash:string= bcrypt.hashSync(data.password,parseInt(process.env.SALT_ROUNDS!));
        data.password=passwordHash;

        let createdUser=await this.prisma.user.create({
            data
          });

       if(createdUser.id)
       {
        responsePayload.data={user:createdUser};
        responsePayload.message.push(Strings.user.created_success);
        responsePayload.statusCode=HttpStatus.CREATED;
        return responsePayload;
       }
       else throw new Error(Strings.user.create_user_database_error);
      
    }
    catch(err){
        if(ErrorCodes[err?.code])
        {
            err.message=errorGenerator(err);
        }
        throw new BadRequestException({statusCode:HttpStatus.BAD_REQUEST,
        message:[Strings.user.created_error], error:err.message});   
    }  
    
  }

  async login(body:LoginDto){
    let responsePayload:CustomResponse={
      statusCode:HttpStatus.AMBIGUOUS,
      data:{},
      message:[]
    }
    try{

       let user= await this.prisma.user.findUnique({where:{email:body.email}})

       if(!user){
        throw new Error(Strings.user.invalid_email);
       }
      
       if(!validatePassword(body.password,user.password)){
        throw new Error(Strings.user.validate_failed);
       }
       
       let token=this.generateToken(user);

       responsePayload.data={token}
       responsePayload.message.push(Strings.user.login_success);
       responsePayload.statusCode=HttpStatus.OK;
       return responsePayload;
   

    }
    catch(err)
    {        
         throw new UnauthorizedException({
          error:err.message,
          message:[Strings.user.login_failure],
          statusCode:HttpStatus.UNAUTHORIZED
         })
    }

  }

  private generateToken(userPayload:LoginDto){
    try{
     return this.jwtService.sign(userPayload,{secret:process.env.JWT_SECRET_KEY})
    }
    catch(err)
    {
      throw new Error(Strings.user.token_failure);
    }
  }
}
