import {
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common/interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { CustomResponse } from '../utils/types';
import { UseInterceptors } from '@nestjs/common/decorators';

export function Serialize(dto:any){
    return UseInterceptors(new ResponseSerialization(dto));
}

class ResponseSerialization implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((responsePayload: CustomResponse) => {
        const entity = Object.keys(this.dto)?.[0];

        const filteredData = plainToInstance(
          this.dto[entity],
          responsePayload.data[entity],
          {excludeExtraneousValues:true}
        );
        
        responsePayload.data = { [entity]: filteredData };
        return responsePayload;
      }),
    );
  }
}
