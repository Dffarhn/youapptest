import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { BadRequestException, HttpStatus, NotFoundException } from '@nestjs/common';
import { CreateUserProfileDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user.dto';
import { ResponseDto } from 'src/utils/dtoResponse/response.dto';
import { UserProfileDTO } from './interface/getProfile.interface';

// Create a mock User model
const mockUserModel = {
  findOneAndUpdate: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  exec: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user profile successfully', async () => {
      const createUserDto: CreateUserProfileDto = {
        displayName: 'John Doe',
        gender: 'male',
        birthday: new Date('2004-04-20T00:00:00.000Z'),
        height: 175,
        weight: 70,
      };

      const user = { _id: 'user-id', ...createUserDto, save: jest.fn().mockResolvedValue(true) };
      mockUserModel.findOneAndUpdate.mockResolvedValue(user);
      mockUserModel.save.mockResolvedValue(user);

      const result = await service.create('user-id', createUserDto);

      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'user-id' }, createUserDto, { new: true });
      expect(result).toEqual(new ResponseDto(HttpStatus.OK, "User created successfully", expect.any(UserProfileDTO)));
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findOneAndUpdate.mockResolvedValue(null);

      try {
        await service.create('user-id', {} as CreateUserProfileDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('User not found');
      }
    });

    it('should throw BadRequestException for invalid date format', async () => {
      const createUserDto: CreateUserProfileDto = {
        displayName: 'John Doe',
        gender: 'male',
        birthday: new Date('2004-04acjsbacbsajkcbkbas'), // Invalid date format
        height: 175,
        weight: 70,
      };

      try {
        await service.create('user-id', createUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid date format for birthday');
      }
    });
  });

  describe('findOne', () => {
    it('should find a user profile successfully', async () => {
      const user = { _id: 'user-id', displayName: 'John Doe' };
      mockUserModel.findOne.mockResolvedValue(user);

      const result = await service.findOne('user-id');

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ _id: 'user-id' });
      expect(result).toEqual(new ResponseDto(HttpStatus.OK, "Get Profile User Successfully", expect.any(UserProfileDTO)));
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      try {
        await service.findOne('user-id');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('User not found');
      }
    });
  });

  describe('update', () => {
    it('should update a user profile successfully', async () => {
      const updateUserDto: UpdateUserProfileDto = {
        displayName: 'Jane Doe',
        gender: 'female',
        birthday: new Date('2005-05-21T00:00:00.000Z'),
        height: 160,
        weight: 55,
      };

      const user = { _id: 'user-id', ...updateUserDto, save: jest.fn().mockResolvedValue(true) };
      mockUserModel.findOneAndUpdate.mockResolvedValue(user);
      mockUserModel.save.mockResolvedValue(user);

      const result = await service.update('user-id', updateUserDto);

      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'user-id' }, updateUserDto, { new: true });
      expect(result).toEqual(new ResponseDto(HttpStatus.OK, "User updated successfully", expect.any(UserProfileDTO)));
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findOneAndUpdate.mockResolvedValue(null);

      try {
        await service.update('user-id', {});
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('User not found');
      }
    });

    it('should throw BadRequestException for invalid date format', async () => {
      const updateUserDto: UpdateUserProfileDto = {
        displayName: 'Jane Doe',
        gender: 'female',
        birthday: new Date('2004-04acjsbacbsajkcbkbas'), // Invalid date format
        height: 160,
        weight: 55,
      };

      try {
        await service.update('user-id', updateUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid date format for birthday');
      }
    });
  });
});
