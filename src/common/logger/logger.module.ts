import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { WinstonLoggerService } from './winston-logger/winston-logger.service';

@Module({
  providers: [ConfigService, WinstonLoggerService],
  exports: [WinstonLoggerService],
})
export class LoggerModule {}
