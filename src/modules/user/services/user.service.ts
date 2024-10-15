import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { WinstonLoggerService } from 'src/common/logger/winston-logger/winston-logger.service';

import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly logger: WinstonLoggerService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    this.logger.log(`Finding user by email: ${email}`);
    return this.userModel.findOne({ email });
  }

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    this.logger.log(`Creating user with email: ${email}, name: ${name}`);
    const hashedPassword = await this.hashPassword(password);
    return this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  }
}
