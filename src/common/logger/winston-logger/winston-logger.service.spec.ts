import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { mockConfigService } from 'src/mocks/auth.mock';
import * as winston from 'winston'; // Import winston for mocking

import { WinstonLoggerService } from './winston-logger.service';

jest.mock('winston', () => {
  const mLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  return {
    createLogger: jest.fn(() => mLogger),
    format: {
      combine: jest.fn(),
      timestamp: jest.fn(),
      printf: jest.fn(),
    },
    transports: {
      Console: jest.fn(),
      File: jest.fn(),
    },
  };
});

describe('WinstonLoggerService', () => {
  let service: WinstonLoggerService;

  const mockLogger = winston.createLogger();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ConfigService, useValue: mockConfigService },
        WinstonLoggerService,
      ],
    }).compile();

    service = module.get<WinstonLoggerService>(WinstonLoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call winston.info when log is called', () => {
    const message = 'Test log message';
    service.log(message);
    expect(mockLogger.info).toHaveBeenCalledWith(message);
  });

  it('should call winston.error when error is called', () => {
    const message = 'Test error message';
    const trace = 'Test error trace';
    service.error(message, trace);
    expect(mockLogger.error).toHaveBeenCalledWith(`${message} -> ${trace}`);
  });

  it('should call winston.warn when warn is called', () => {
    const message = 'Test warn message';
    service.warn(message);
    expect(mockLogger.warn).toHaveBeenCalledWith(message);
  });

  it('should call winston.debug when debug is called', () => {
    const message = 'Test debug message';
    service.debug(message);
    expect(mockLogger.debug).toHaveBeenCalledWith(message);
  });

  it('should call winston.verbose when verbose is called', () => {
    const message = 'Test verbose message';
    service.verbose(message);
    expect(mockLogger.verbose).toHaveBeenCalledWith(message);
  });
});
