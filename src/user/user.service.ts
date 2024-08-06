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


  private getHoroscope(birthday: Date): string {
    const month = birthday.getMonth() + 1;
    const day = birthday.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return 'Gemini';
    if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return 'Libra';
    if ((month === 10 && day >= 24) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';

    return 'Unknown'; // In case of an invalid date
  }

  private getZodiac(birthday: Date): string {
    const year = birthday.getFullYear();
    const zodiacs = [
      'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
    ];
    return zodiacs[(year - 4) % 12];
  }

  private parseDate(dateString: any): Date {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format for birthday');
    }
    return date;
  }




  async create(@UserId() id: string, createUserDto: CreateUserProfileDto): Promise<ResponseDto<UserProfileDTO>> {
    const user = await this.userModel.findOneAndUpdate({ _id: id }, createUserDto, { new: true }).exec();
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    if (createUserDto.birthday) {
      const birthday = this.parseDate(createUserDto.birthday);
      user.horoscope = this.getHoroscope(birthday);
      user.zodiac = this.getZodiac(birthday);
    }

    await user.save();

    const userProfile = plainToClass(UserProfileDTO, user.toObject(), { excludeExtraneousValues: true });

    return new ResponseDto(HttpStatus.OK, "User created successfully", userProfile);
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

    if (updateUserDto.birthday) {
      const birthday = this.parseDate(updateUserDto.birthday);
      user.horoscope = this.getHoroscope(birthday);
      user.zodiac = this.getZodiac(birthday);
    }

    await user.save();

    const userProfile = plainToClass(UserProfileDTO, user.toObject(), { excludeExtraneousValues: true });

    return new ResponseDto(HttpStatus.OK, "User updated successfully", userProfile);
  }
}