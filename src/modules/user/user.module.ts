import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'src/common/logger/logger.module';

import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './services/user.service';

@Module({
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    LoggerModule,
  ],
  exports: [MongooseModule, UserService],
})
export class UserModule {}
