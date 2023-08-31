import { Injectable,HttpStatus} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dtos/user-create.dto';
import { CustomResponse } from 'src/utils/types';
import Strings from 'src/utils/Strings';
import { ErrorCodes } from 'src/utils/Constatns';
import { errorGenerator } from 'src/utils/Commons';
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}


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
}
