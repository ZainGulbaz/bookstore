import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CustomResponse } from 'src/utils/types';
import { CreateBookDto } from './dtos/create-book.dto';
import Strings from 'src/utils/Strings';
import { ErrorCodes } from 'src/utils/Constatns';
import { errorGenerator } from 'src/utils/Commons';
import { FindBooksDto } from './dtos/find-books.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBookDto): Promise<CustomResponse> {
    let responsePayload: CustomResponse = {
      statusCode: HttpStatus.AMBIGUOUS,
      message: [],
      data: {},
    };
    try {      


        let createdBook = await this.prisma.book.create({
        data:{
          title:data.title,
          points:data.points,
          writer:data.writer
        },
      });

    
      if (createdBook.id) {

        for(const tag of data?.tags)
        {
            let createdTag = await this.prisma.tag.create({
                data:{
                    name:tag,
                    bookId:createdBook.id
                },
              });
        }    
        
        responsePayload.message.push(Strings.book.created_success);
        responsePayload.statusCode = HttpStatus.CREATED;
        responsePayload.data = {
          book: {...createdBook,tags:data?.tags},
        };
        return;
      }

      throw new Error(Strings.book.create_book_database_error);
    } catch (err) {
      console.error(err);  
      if (ErrorCodes[err?.code]) {
        responsePayload.message.push(errorGenerator(err));
      }  
      responsePayload.message.push(Strings.book.created_error);
      responsePayload.message.push(err.message);

      responsePayload.statusCode = HttpStatus.BAD_REQUEST;
    } finally {
      return responsePayload;
    }
  }

  async findAll(data:FindBooksDto):Promise<CustomResponse>{
    let responsePayload:CustomResponse={
        statusCode:HttpStatus.AMBIGUOUS,
        data:{},
        message:[]
    }
    try{
        let books= await this.prisma.book.findMany({skip:parseInt(data.skip),take:parseInt(data.take)})
        if(books)
        {

            responsePayload.data={
                books
            };
            responsePayload.message.push(Strings.book.find_many_success);
            responsePayload.statusCode=HttpStatus.FOUND;
            return;

        }

        throw new Error(Strings.book.find_many_database_error);
  
    }
    catch(err)
    {
        if(ErrorCodes[err?.code])
        {
            responsePayload.message.push(errorGenerator(err));
        }
        responsePayload.message.push(Strings.book.find_many_error);
        responsePayload.message.push(err.message);
        responsePayload.statusCode=HttpStatus.BAD_REQUEST;
    }
    finally{
    return responsePayload;
    }
  }
}
