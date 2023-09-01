import {Expose} from "class-transformer";

export class CreateUserResponseDto{

    @Expose()
    id:number;

    @Expose()
    email:string;

}