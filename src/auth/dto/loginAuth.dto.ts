import { PartialType } from "@nestjs/mapped-types";
import { RegisterAuthDto } from "./registerAuth.dto";


export class LoginAuthDto extends PartialType(RegisterAuthDto){}
