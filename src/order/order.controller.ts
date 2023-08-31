import { Controller,Post,Req,Body, Param,Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dtos/order-create.dto';
import { Request } from 'express';
import { User } from '@prisma/client';

@Controller('order')
export class OrderController {

    constructor(private orderService: OrderService){}

    @Post()
    async createOrder(@Req() req:Request, @Body() body:CreateOrderDto){
        const user:User= req["user"];
        return await this.orderService.create(body,user);
    }

    @Put("/cancel/:id")
    async cancelOrder(@Req() req:Request, @Param("id") id:string){
         const user:User=req["user"];
         return await this.orderService.cancelOrder(parseInt(id),user.id);
    }
}
