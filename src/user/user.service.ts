import { Injectable,HttpStatus} from '@nestjs/common';
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
        return;
       }
       else throw new Error(Strings.user.create_user_database_error);
      
    }
    catch(err){
       
        if(ErrorCodes[err?.code])
        {
            responsePayload.message.push(errorGenerator(err));
        }
        responsePayload.message.push(Strings.user.created_error);
        responsePayload.message.push(err.message);
    }
    finally{
        return responsePayload;
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
        responsePayload.message.push(Strings.user.invalid_email);
        throw new Error();
       }
      
       if(!validatePassword(body.password,user.password)){
        responsePayload.message.push(Strings.user.validate_failed);
        throw new Error();
       }
       
       console.log(user);

       let token=this.generateToken(user);

       responsePayload.data={token}
       responsePayload.message.push(Strings.user.login_success);
       responsePayload.statusCode=HttpStatus.OK;
   

    }
    catch(err)
    {
         responsePayload.message.push(Strings.user.login_failure);
         responsePayload.message.push(err.message);
         responsePayload.statusCode=HttpStatus.UNAUTHORIZED;
    }
    finally{
      return responsePayload;
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
