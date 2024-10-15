import { Test, TestingModule } from '@nestjs/testing';
import {
  createExpectedSignupResponse,
  mockAuthService,
} from 'src/mocks/auth.mock';

import { SigninDto, SignupDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService, // Use the reusable mock service
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should sign up a new user and return tokens', async () => {
      const signupDto: SignupDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password@123',
      };

      const result = await controller.signup(signupDto);

      expect(result).toEqual(
        createExpectedSignupResponse(signupDto.name, signupDto.email),
      );

      expect(mockAuthService.signup).toHaveBeenCalledWith(
        signupDto.name,
        signupDto.email,
        signupDto.password,
      );
    });
  });

  describe('signin', () => {
    it('should sign in a user and return tokens', async () => {
      const signinDto: SigninDto = {
        email: 'john@example.com',
        password: 'Password@123',
      };

      const result = await controller.signin(signinDto);

      expect(result).toEqual(
        createExpectedSignupResponse(signinDto.email, signinDto.password),
      );

      expect(mockAuthService.signin).toHaveBeenCalledWith(
        signinDto.email,
        signinDto.password,
      );
    });
  });
});
