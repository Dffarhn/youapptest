import { HttpStatus, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserId } from 'src/utils/decorator/userIdAuth.decorator';
import { CreateUserProfileDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user.dto';
import { ResponseDto } from 'src/utils/dtoResponse/response.dto';

import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { UserProfileDTO } from './interface/getProfile.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(@UserId() id: string, createUserDto: CreateUserProfileDto): Promise<ResponseDto<UserProfileDTO>> {
    const user = await this.userModel.findOneAndUpdate({ _id: id }, createUserDto, { new: true }).exec();
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    const userProfile = plainToClass(UserProfileDTO, user.toObject(), { excludeExtraneousValues: true });
    return new ResponseDto(HttpStatus.OK, "User updated successfully", userProfile);
  }
  

  async findOne(id: string): Promise<ResponseDto<UserProfileDTO>> {
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    const userProfile = plainToClass(UserProfileDTO, user.toObject(), { excludeExtraneousValues: true });
    return new ResponseDto(HttpStatus.OK, "Get Profile User Successfully", userProfile);
  }

  async update(@UserId() id: string, updateUserDto: UpdateUserProfileDto): Promise<ResponseDto<UserProfileDTO>> {
    const user = await this.userModel.findOneAndUpdate({ _id: id }, updateUserDto, { new: true }).exec();
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    const userProfile = plainToClass(UserProfileDTO, user.toObject(), { excludeExtraneousValues: true });
    return new ResponseDto(HttpStatus.OK, "User updated successfully", userProfile);
  }
}