import { IsEmail, IsString, MinLength } from "class-validator";
import { IsNotBlank } from "src/utils/validator/isNotBlank.validator";
import { IsPasswordComplex } from "src/utils/validator/IsPasswordComplex.validator";
import { IsPasswordMatch } from "src/utils/validator/IsPasswordMatch.validator";

export class RegisterAuthDto {

    @IsEmail()
    email:string;

    @IsString()
    @MinLength(6)
    @IsNotBlank()
    username:string;
    


    @IsString()
    @MinLength(6)
    @IsNotBlank()
    @IsPasswordComplex()
    password: string;
    
    
    @IsString()
    @MinLength(6)
    @IsNotBlank()
    @IsPasswordComplex()
    @IsPasswordMatch("password")
    confirmpassword: string;
    
}
