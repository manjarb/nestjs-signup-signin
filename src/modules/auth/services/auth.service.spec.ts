import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import {
  mockConfigService,
  mockJwtService,
  mockUser,
  mockUserService,
} from 'src/mocks/auth.mock';
import { UserService } from 'src/modules/user/services/user.service';

import { SignupResponse } from '../auth.interface';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
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
        user: mockUser.toObject(),
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
