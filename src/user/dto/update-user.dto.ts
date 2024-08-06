import { PartialType } from '@nestjs/mapped-types';
import { CreateUserProfileDto } from './create-user.dto';

export class UpdateUserProfileDto extends PartialType(CreateUserProfileDto) {}
