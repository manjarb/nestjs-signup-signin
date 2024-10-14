import { User } from '../user/schemas/user.schema';

export interface SignupResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface SigninResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
}
