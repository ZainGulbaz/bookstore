import { Module,MiddlewareConsumer,NestModule,RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { JwtAuthMiddleware } from './jwt-auth.middleware';
import { UserController } from './user/user.controller';
import { OrderController } from './order/order.controller';
import { JwtService } from '@nestjs/jwt';
import { BooksController } from './books/books.controller';

@Module({
  imports: [BooksModule, OrderModule, UserModule],
  controllers: [AppController],
  providers: [AppService,JwtService],
})


export class AppModule implements NestModule {
  
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .exclude(
        {
          path: `/auth/signup`,
          method: RequestMethod.POST,
        },
        {
          path:"/auth/login",
          method:RequestMethod.POST
        }
       
      )
      .forRoutes(UserController,OrderController,BooksController);
  }
}
