import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [BooksController],
  providers: [BooksService,PrismaService]
})
export class BooksModule {}
