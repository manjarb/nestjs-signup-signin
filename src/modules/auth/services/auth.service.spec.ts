import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { WinstonLoggerService } from 'src/common/logger/winston-logger/winston-logger.service';
import { AUTH_ERRORS } from 'src/constant/auth.constants';
import {
  mockConfigService,
  mockJwtService,
  mockUser,
  mockUserService,
} from 'src/mocks/auth.mock';
import { mockWinstonLoggerService } from 'src/mocks/common.mock';
import { UserService } from 'src/modules/user/services/user.service';

import { SignupResponse } from '../auth.interface';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: WinstonLoggerService, useValue: mockWinstonLoggerService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('comparePassword', () => {
    it('should compare passwords correctly', async () => {
      const plainPassword = 'Password@123';
      const hashedPassword = 'hashedPassword';
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService['comparePassword'](
        plainPassword,
        hashedPassword,
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        plainPassword,
        hashedPassword,
      );
      expect(result).toBe(true);
    });
  });

  describe('signup', () => {
    it('should throw conflict error if user already exists', async () => {
      mockUserService.findUserByEmail.mockResolvedValue(mockUser);

      await expect(
        authService.signup(mockUser.name, mockUser.email, mockUser.password),
      ).rejects.toThrow(
        new HttpException('User already exists', HttpStatus.CONFLICT),
      );

      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith(
        mockUser.email,
      );
    });

    it('should successfully sign up a user and return tokens', async () => {
      mockUserService.findUserByEmail.mockResolvedValue(null);
      mockUserService.createUser.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      mockJwtService.sign.mockReturnValue('access-token');
      mockConfigService.get.mockReturnValue('7d');

      const result: SignupResponse = await authService.signup(
        mockUser.name,
        mockUser.email,
        mockUser.password,
      );

      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith(
        mockUser.email,
      );
      expect(mockUserService.createUser).toHaveBeenCalledWith(
        mockUser.name,
        mockUser.email,
        'Password@123',
      );

      expect(result).toEqual({
        user: {
          ...mockUser.toObject(),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
        accessToken: 'access-token',
        refreshToken: 'access-token',
      });
    });
  });

  describe('signin', () => {
    it('should throw unauthorized error if user is not found', async () => {
      mockUserService.findUserByEmail.mockResolvedValue(null);

      await expect(
        authService.signin(mockUser.email, mockUser.password),
      ).rejects.toThrow(
        new HttpException(AUTH_ERRORS.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED),
      );

      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith(
        mockUser.email,
      );
    });

    it('should throw unauthorized error if password is incorrect', async () => {
      mockUserService.findUserByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        authService.signin(mockUser.email, mockUser.password),
      ).rejects.toThrow(
        new HttpException(
          AUTH_ERRORS.PASSWORD_INCORRECT,
          HttpStatus.UNAUTHORIZED,
        ),
      );

      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith(
        mockUser.email,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockUser.password,
        mockUser.password,
      );
    });

    it('should successfully sign in a user and return tokens', async () => {
      mockUserService.findUserByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue('access-token');
      mockConfigService.get.mockReturnValue('7d');

      const result = await authService.signin(
        mockUser.email,
        mockUser.password,
      );

      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith(
        mockUser.email,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockUser.password,
        mockUser.password,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser._id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual({
        user: {
          _id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
        accessToken: 'access-token',
        refreshToken: 'access-token',
      });
    });
  });

  describe('generateAccessToken', () => {
    it('should generate an access token', () => {
      mockJwtService.sign.mockReturnValue('access-token');
      const result = authService['generateAccessToken'](mockUser);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser._id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toBe('access-token');
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token', () => {
      mockJwtService.sign.mockReturnValue('refresh-token');
      mockConfigService.get.mockReturnValue('7d');

      const result = authService['generateRefreshToken'](mockUser);

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { sub: mockUser._id },
        { expiresIn: '7d' },
      );
      expect(result).toBe('refresh-token');
    });
  });
});
