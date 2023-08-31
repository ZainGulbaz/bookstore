import {IsString,IsNumber,ArrayMinSize} from "class-validator";
export class CreateBookDto{

    @IsString()
    title:string;

    @IsString()
    writer:string;

    @IsNumber()
    points:number;

    @IsString({each:true})
    @ArrayMinSize(1)
    tags:string[]

}