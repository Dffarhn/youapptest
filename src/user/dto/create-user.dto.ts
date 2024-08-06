import { Type } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";
import { IsNotBlank } from "src/utils/validator/isNotBlank.validator";

export class CreateUserProfileDto {
    @IsOptional()
    @IsNotBlank()
    @IsString()
    displayName:string
    
    @IsOptional()
    @IsNotBlank()
    @IsString()
    gender:string

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    birthday: Date;


    @IsOptional()
    @IsNumber()
    height:number
    
    @IsOptional()
    @IsNumber()
    weight:number

    
}
