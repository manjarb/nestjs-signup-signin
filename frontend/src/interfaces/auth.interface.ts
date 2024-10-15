export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignupResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}
