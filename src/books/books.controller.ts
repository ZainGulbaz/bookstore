import { Controller,Post,Body,Get,Query } from '@nestjs/common';
import { CustomResponse } from 'src/utils/types';
import { BooksService } from './books.service';
import { CreateBookDto } from './dtos/create-book.dto';
import { FindBooksDto } from './dtos/find-books.dto';

@Controller('book')
export class BooksController {

    constructor(private bookService:BooksService){}
  
    @Post()
    async createBooks(@Body() body:CreateBookDto):Promise<CustomResponse>
    {
      return await this.bookService.create(body);
    }

    @Get()
    async getBooks(@Query() queryParams:FindBooksDto):Promise<CustomResponse>{
       return this.bookService.findAll(queryParams);
    }


}
