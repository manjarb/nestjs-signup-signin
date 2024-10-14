import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

import { ResponseInterceptor } from './response.interceptor';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();
  });

  it('should be defined', () => {
    expect(new ResponseInterceptor()).toBeDefined();
  });

  it('should wrap the response data with an object containing data and timestamp', (done) => {
    const mockExecutionContext = {} as ExecutionContext;

    const mockCallHandler: CallHandler = {
      handle: jest.fn(() => of({ message: 'Success' })),
    };

    interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .subscribe((result) => {
        expect(result).toEqual({
          data: { message: 'Success' },
          timestamp: expect.any(Number),
        });
        done();
      });

    expect(mockCallHandler.handle).toHaveBeenCalled();
  });
});
