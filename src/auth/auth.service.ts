import { ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterAuthDto } from './dto/registerAuth.dto';
import { LoginAuthDto } from './dto/loginAuth.dto';
import { ResponseDto } from 'src/utils/dtoResponse/response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import * as bcrypt from 'bcrypt';

import{v4 as uuidv4} from 'uuid'
import { RegisterInterface } from './interfaces/register.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginInterface } from './interfaces/login.interface';


@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,

    private readonly jwtService: JwtService
  ){}


  async register(registerAuthDto: RegisterAuthDto): Promise<ResponseDto<RegisterInterface>> {
    const { email,username, password } = registerAuthDto;
    
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User already exists');

    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    registerAuthDto.username = `@${username}`
    const user = new this.userModel({ ...registerAuthDto, password: hashedPassword });

    await user.save();
    return new ResponseDto(HttpStatus.CREATED, 'Register is successful', {
      email: registerAuthDto.email,
      username: registerAuthDto.username,
    });
  }
  
  async login(loginAuthDto: LoginAuthDto):Promise<ResponseDto<LoginInterface>> {
    const {email, password} = loginAuthDto 

     // Find user by email
     const user = await this.userModel.findOne({ email });
     if (!user) {
       throw new UnauthorizedException('Invalid credentials');
     }
 
     // Check if password is correct
     const isPasswordValid = await bcrypt.compare(password, user.password);
     if (!isPasswordValid) {
       throw new UnauthorizedException('Invalid credentials');
     }
 
     // Generate JWT token
     const payload = { email: user.email, id: user._id };
     const access_token = this.jwtService.sign(payload);



    return new ResponseDto(HttpStatus.OK,"Login Is Successfully",{
      access_token:access_token
    });
  }
}
