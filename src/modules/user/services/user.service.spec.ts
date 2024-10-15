import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { mockUser } from 'src/mocks/auth.mock';

import { User, UserDocument } from '../schemas/user.schema';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<UserDocument>;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name), // Mocking the Mongoose model
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should hash a password correctly', async () => {
      const password = 'Password@123';
      const salt = 'generatedSalt123';
      const hashedPassword = 'hashedPassword';

      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue(salt as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

      const result = await service['hashPassword'](password);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('findUserByEmail', () => {
    it('should return a user if one is found', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.findUserByEmail('john@example.com');

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'john@example.com',
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user is found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      const result = await service.findUserByEmail('nonexistent@example.com');

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'nonexistent@example.com',
      });
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should hash the password and create a new user', async () => {
      const plainPassword = 'Password@123';
      const hashedPassword = 'hashedPassword';
      const salt = 'generatedSalt123';
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue(salt as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      mockUserModel.create.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      const result = await service.createUser(
        'John Doe',
        'john@example.com',
        plainPassword,
      );

      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, salt);
      expect(userModel.create).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
      });
      delete result.toObject;
      expect(result).toEqual({
        _id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });
});
