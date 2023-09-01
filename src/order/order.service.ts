import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateOrderDto } from './dtos/order-create.dto';
import { CustomResponse } from 'src/utils/types';
import { Order, User } from '@prisma/client';
import Strings from 'src/utils/Strings';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(body: CreateOrderDto, user: User) {
    let responsePayload: CustomResponse = {
      statusCode: HttpStatus.AMBIGUOUS,
      data: {},
      message: [],
    };

    try {
      let totalPointsToBeDebited = await this.validateUsersPoints(
        user.id,
        body.bookIds,
      );

      if (totalPointsToBeDebited == false) {
        throw new UnprocessableEntityException({
          message: [Strings.order.created_failure],
          error: Strings.order.insufficient_funds,
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        });
      }

      let createdOrder = await this.prisma.order.create({
        data: { userId: user.id, points: totalPointsToBeDebited },
      });

      const orderBookJunctionData = [];

      if (createdOrder.id) {
        for (const bookId of body.bookIds) {
          orderBookJunctionData.push({
            bookId: parseInt(bookId + ''),
            orderId: createdOrder.id,
          });
        }
        let orderBookJunctionTableRes =
          await this.prisma.ordersOnBooks.createMany({
            data: orderBookJunctionData,
          });

        // debit the points
        if (orderBookJunctionTableRes.count) {
          let isDebited = await this.debitPoints(
            user.id,
            totalPointsToBeDebited,
          );

          if (isDebited == false) {
            //cancel the order
            this.changeOrderStatus(createdOrder.id, true);

            throw new Error(Strings.order.payment_failure);
          }

          responsePayload.message.push(Strings.order.created_success);
          responsePayload.message.push(Strings.order.payment_success);
          responsePayload.statusCode = HttpStatus.CREATED;
          responsePayload.data = {
            order: {
              ...createdOrder,
              bookIds: body.bookIds,
            },
          };
          return responsePayload;
        }
      }

      throw new Error(Strings.order.created_failure_database);
    } catch (err) {
      if (err.response && err.response.statusCode === HttpStatus.UNPROCESSABLE_ENTITY)
        throw new UnprocessableEntityException(err.response);

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: [Strings.order.created_failure],
        error: err.message,
      });
    }
  }

  async cancelOrder(
    orderId: Order['id'],
    userId: User['id'],
  ): Promise<CustomResponse> {
    let responsePayload: CustomResponse = {
      statusCode: HttpStatus.AMBIGUOUS,
      message: [],
      data: {},
    };
    try {
      let order = await this.prisma.order.findUnique({
        where: { id: orderId },
      });

      //user validation
      if (order.userId !== userId) {
        throw new UnauthorizedException({
          statusCode:HttpStatus.UNAUTHORIZED,
          message:[Strings.order.cancel_failure],
          error:Strings.order.unauthorized_order_access,
        })
      }

      if (order.isCancel) {
       throw new Error(Strings.order.order_already_canceled);
      }
      let cancelOrder = await this.prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          isCancel: true,
        },
      });
      if (cancelOrder.id) {
        let ArePointsCredited = await this.creditPoints(
          userId,
          cancelOrder.points,
        );
        if (ArePointsCredited == false) {
          this.changeOrderStatus(orderId, false);
          throw new Error(Strings.order.points_credited_error);
        }
        responsePayload.data = { order: cancelOrder };
        responsePayload.message.push(Strings.order.cancel_success);
        responsePayload.statusCode = HttpStatus.OK;
        return responsePayload;
      }
      throw new Error(Strings.order.cancel_database_failure);
    } catch (err) {
      if(err.response && err.response.statusCode==HttpStatus.UNAUTHORIZED) throw new UnauthorizedException(err.response);
      
      throw new BadRequestException({
         message:[Strings.order.cancel_failure],
         error:err.message,
         statusCode:HttpStatus.BAD_REQUEST
      });
    } 
  }

  //------------------------------------------ HELPER METHODS -----------------------------------------------
  private async creditPoints(userId: number, refunedPoints: number) {
    try {
      let updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: refunedPoints,
          },
        },
      });
      if (updatedUser) return true;
      else return false;
    } catch (err) {
      throw new Error(err);
    }
  }
  private async changeOrderStatus(
    orderId: number,
    status: boolean,
  ): Promise<false | number> {
    try {
      let res = await this.prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          isCancel: status,
        },
      });
      if (res.id) {
        return res.id;
      } else false;
    } catch (err) {
      throw new Error(err);
    }
  }

  private async validateUsersPoints(
    userId: number,
    bookIds: string[],
  ): Promise<false | number> {
    try {
      let booksPointsRes = await this.prisma.book.aggregate({
        _sum: { points: true },
        where: { id: { in: bookIds?.map((id) => parseInt(id)) } },
      });
      let user = await this.prisma.user.findUnique({ where: { id: userId } });

      if (
        booksPointsRes._sum.points &&
        user.points > booksPointsRes._sum.points
      ) {
        return booksPointsRes._sum.points;
      }
      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  private async debitPoints(userId: number, points: number): Promise<boolean> {
    try {
      let updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          points: {
            decrement: points,
          },
        },
      });
      if (updatedUser.id) {
        return true;
      }
      return false;
    } catch (err) {
      throw new Error(err);
    }
  }
}
