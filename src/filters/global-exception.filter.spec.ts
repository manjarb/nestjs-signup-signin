import { HttpException, HttpStatus } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { MongoError } from 'mongodb';

import { GlobalExceptionFilter } from './global-exception.filter';

describe('GlobalExceptionFilter', () => {
  let exceptionFilter: GlobalExceptionFilter;

  beforeEach(() => {
    exceptionFilter = new GlobalExceptionFilter();
  });

  const mockResponse = () => {
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    return res;
  };

  const mockHost = (response: any): ArgumentsHost => {
    const ctx: any = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue(response),
    };
    return { switchToHttp: () => ctx } as ArgumentsHost;
  };

  it('should handle HttpException with custom status and message', () => {
    const response = mockResponse();
    const host = mockHost(response);

    const exception = new HttpException(
      'Custom error message',
      HttpStatus.BAD_REQUEST,
    );

    exceptionFilter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Custom error message',
      timestamp: expect.any(Number),
    });
  });

  it('should handle MongoError duplicate key error (code 11000)', () => {
    const response = mockResponse();
    const host = mockHost(response);

    const exception = new MongoError('Duplicate key');
    exception.code = 11000;

    exceptionFilter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.CONFLICT,
      message:
        'Duplicate entry error: A record with the same unique field already exists.',
      timestamp: expect.any(Number),
    });
  });

  it('should handle validation errors with status BAD_REQUEST', () => {
    const response = mockResponse();
    const host = mockHost(response);

    const exception = { name: 'ValidationError' };

    exceptionFilter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation error: Invalid data provided.',
      timestamp: expect.any(Number),
    });
  });

  it('should handle unknown exceptions as INTERNAL_SERVER_ERROR', () => {
    const response = mockResponse();
    const host = mockHost(response);

    const exception = new Error('Unknown error');

    exceptionFilter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      timestamp: expect.any(Number),
    });
  });
});
