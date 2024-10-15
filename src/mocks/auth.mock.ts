import { SignupResponse } from 'src/modules/auth/auth.interface';
import { User, UserRole } from 'src/modules/user/schemas/user.schema';

export const mockUser = {
  _id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'Password@123',
  role: UserRole.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
  toObject() {
    return {
      _id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
} as User;

export function createExpectedSignupResponse(name: string, email: string) {
  return {
    user: {
      _id: '123',
      name,
      email,
      role: UserRole.USER,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    } as any,
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  };
}

export const mockAuthService = {
  signup: jest.fn((name: string, email: string): SignupResponse => {
    return createExpectedSignupResponse(name, email);
  }),
  signin: jest.fn((name: string, email: string): SignupResponse => {
    return createExpectedSignupResponse(name, email);
  }),
};

export const mockUserService = {
  findUserByEmail: jest.fn(),
  createUser: jest.fn(),
};

export const mockJwtService = {
  sign: jest.fn(),
};

export const mockConfigService = {
  get: jest.fn(),
};
