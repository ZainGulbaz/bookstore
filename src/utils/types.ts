import Strings from "./Strings"
import { HttpStatus } from "@nestjs/common/enums";


type StringsType= typeof Strings;
export type EntityStringsType=StringsType[keyof StringsType];

export type CustomResponse ={
    message:String[],
    data:any,
    statusCode:HttpStatus
}
