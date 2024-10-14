import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/user/schemas/user.schema';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  // Helper method to hash passwords
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  // Helper method to compare passwords
  private async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async signup(name: string, email: string, password: string): Promise<User> {
    const hashedPassword = await this.hashPassword(password);
    return this.userService.createUser(name, email, hashedPassword);
  }

  // async signin(email: string, password: string): Promise<User | null> {
  //   const user = await this.userService.findUserByEmail(email);
  //   if (user && (await this.comparePassword(password, user.password))) {
  //     return user; // Password is correct
  //   }
  //   return null; // Incorrect credentials
  // }
}
