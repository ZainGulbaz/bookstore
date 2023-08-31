import {IsString} from "class-validator";

export class FindBooksDto {
    @IsString()
    skip:string;

    @IsString()
    take:string;
}