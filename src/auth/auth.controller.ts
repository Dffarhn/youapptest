import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/registerAuth.dto';
import { LoginAuthDto } from './dto/loginAuth.dto';
import { ResponseDto } from 'src/utils/dtoResponse/response.dto';
import { RegisterInterface } from './interfaces/register.interface';
import { LoginInterface } from './interfaces/login.interface';


@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerAuthDto: RegisterAuthDto):Promise<ResponseDto<RegisterInterface>> {
    return this.authService.register(registerAuthDto);
  }


  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto): Promise<ResponseDto<LoginInterface>> {
    return this.authService.login(loginAuthDto);
  }





}
