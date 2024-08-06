import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserProfileDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user.dto';
import { ResponseDto } from 'src/utils/dtoResponse/response.dto';

// Create a mock UserService
const mockUserService = {
  create: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user profile', async () => {
      const createUserDto: CreateUserProfileDto = {
        displayName: 'John Doe',
        gender: 'male',
        birthday: new Date('2004-04-20T00:00:00.000Z'),
        height: 175,
        weight: 70,
      };

      const userId = 'user-id';
      mockUserService.create.mockResolvedValue(new ResponseDto(200, "User created successfully", {}));

      const result = await controller.create(userId, createUserDto);

      expect(service.create).toHaveBeenCalledWith(userId, createUserDto);
      expect(result).toEqual(new ResponseDto(200, "User created successfully", {}));
    });

    it('should handle errors when creating a user profile', async () => {
      const createUserDto: CreateUserProfileDto = {
        displayName: 'John Doe',
        gender: 'male',
        birthday: new Date('2004-04-20T00:00:00.000Z'),
        height: 175,
        weight: 70,
      };

      const userId = 'user-id';
      mockUserService.create.mockRejectedValue(new Error('Error creating user'));

      try {
        await controller.create(userId, createUserDto);
      } catch (error) {
        expect(error.response.statusCode).toBe(500);
        expect(error.response.message).toBe('Error creating user');
      }
    });
  });

  describe('findOne', () => {
    it('should find a user profile', async () => {
      const userId = 'user-id';
      mockUserService.findOne.mockResolvedValue(new ResponseDto(200, "User found successfully", {}));

      const result = await controller.findOne(userId);

      expect(service.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(new ResponseDto(200, "User found successfully", {}));
    });

    it('should handle errors when finding a user profile', async () => {
      const userId = 'user-id';
      mockUserService.findOne.mockRejectedValue(new Error('Error finding user'));

      try {
        await controller.findOne(userId);
      } catch (error) {
        expect(error.response.statusCode).toBe(500);
        expect(error.response.message).toBe('Error finding user');
      }
    });
  });

  describe('update', () => {
    it('should update a user profile', async () => {
      const updateUserDto: UpdateUserProfileDto = {
        displayName: 'Jane Doe',
        gender: 'female',
        birthday: new Date('2005-05-21T00:00:00.000Z'),
        height: 160,
        weight: 55,
      };

      const userId = 'user-id';
      mockUserService.update.mockResolvedValue(new ResponseDto(200, "User updated successfully", {}));

      const result = await controller.update(userId, updateUserDto);

      expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(result).toEqual(new ResponseDto(200, "User updated successfully", {}));
    });

    it('should handle errors when updating a user profile', async () => {
      const updateUserDto: UpdateUserProfileDto = {
        displayName: 'Jane Doe',
        gender: 'female',
        birthday: new Date('2005-05-21T00:00:00.000Z'),
        height: 160,
        weight: 55,
      };

      const userId = 'user-id';
      mockUserService.update.mockRejectedValue(new Error('Error updating user'));

      try {
        await controller.update(userId, updateUserDto);
      } catch (error) {
        expect(error.response.statusCode).toBe(500);
        expect(error.response.message).toBe('Error updating user');
      }
    });
  });
});
