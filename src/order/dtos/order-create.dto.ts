import {IsString,ArrayMinSize} from "class-validator";

export class CreateOrderDto{
      
    @IsString({each:true})
    @ArrayMinSize(1)
    bookIds:string[];
}