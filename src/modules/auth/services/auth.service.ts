import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { WinstonLoggerService } from 'src/common/logger/winston-logger/winston-logger.service';
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
    private readonly logger: WinstonLoggerService,
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
    this.logger.log(`Sign-up attempt for email: ${email}`);

    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      this.logger.warn(
        `Sign-up failed: User with email ${email} already exists`,
      );
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const user = await this.userService.createUser(name, email, password);
    this.logger.log(`User with email ${email} successfully signed up`);

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: user.toObject(),
      accessToken,
      refreshToken,
    };
  }

  async signin(email: string, password: string): Promise<SigninResponse> {
    this.logger.log(`Sign-in attempt for email: ${email}`);
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      this.logger.warn(`Sign-in failed: User with email ${email} not found`);
      throw new HttpException(
        AUTH_ERRORS.USER_NOT_FOUND,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Sign-in failed: Incorrect password for email ${email}`);
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

    this.logger.log(`Sign-in successful for email: ${email}`);

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
