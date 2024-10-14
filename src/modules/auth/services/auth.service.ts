import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AUTH_ERRORS } from 'src/constant/auth.constants';
import { User } from 'src/modules/user/schemas/user.schema';
import { UserService } from 'src/modules/user/services/user.service';

import { SigninResponse, SignupResponse } from '../auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async signup(
    name: string,
    email: string,
    password: string,
  ): Promise<SignupResponse> {
    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const user = await this.userService.createUser(name, email, password);

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async signin(email: string, password: string): Promise<SigninResponse> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new HttpException(
        AUTH_ERRORS.USER_NOT_FOUND,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        AUTH_ERRORS.PASSWORD_INCORRECT,
        HttpStatus.UNAUTHORIZED,
      );
    }

    // eslint-disable-next-line
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(user: User): string {
    const payload = { sub: user._id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(user: User): string {
    const payload = { sub: user._id };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });
  }
}
