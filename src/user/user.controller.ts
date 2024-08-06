import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserProfileDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/guard/jwtAuth.guard';
import { UserId } from 'src/utils/decorator/userIdAuth.decorator';


@Controller('api')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("createProfile")
  create(@UserId() userId: string,@Body() createUserDto: CreateUserProfileDto) {
    return this.userService.create(userId,createUserDto);
  }

  @Get("getProfile")
  findOne(@UserId() userId: string) {
    return this.userService.findOne(userId);
  }

  @Patch('updateProfile')
  update(@UserId() userId: string, @Body() updateUserDto: UpdateUserProfileDto) {
    return this.userService.update(userId, updateUserDto);
  }

}
