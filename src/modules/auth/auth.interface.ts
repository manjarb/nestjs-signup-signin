import { User } from '../user/schemas/user.schema';

export interface SignupResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
