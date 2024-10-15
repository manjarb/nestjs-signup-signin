import { renderHook, act, waitFor } from '@testing-library/react';
import axios, { AxiosError } from 'axios';
import { useSignin } from './useSignin';
import { vi } from 'vitest';

// Mock Axios
vi.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('useSignin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // it('should call the signin API and return success data', async() => {
  //   const mockResponse = {
  //     data: {
  //       data: {
  //         user: {
  //           name: 'John Doe',
  //           email: 'johndoe@example.com',
  //           _id: '123',
  //         },
  //         accessToken: 'mockAccessToken',
  //         refreshToken: 'mockRefreshToken',
  //       },
  //     },
  //   };

  //   mockAxios.post.mockResolvedValueOnce(mockResponse);

  //   const { result } = renderHook(() => useSignin());

  //   await act(async() => {
  //     const response = await result.current.signin({
  //       email: 'test@example.com',
  //       password: 'Password123!',
  //     });

  //     expect(response).toEqual(mockResponse.data.data);
  //   });

  //   expect(mockAxios.post).toHaveBeenCalledWith(
  //     'http://localhost:3100/api/v1/auth/signin',
  //     { email: 'test@example.com', password: 'Password123!' },
  //   );
  // });

  it('should set an error when the API call fails', async() => {
    const errorMessage = 'Signin failed. Please try again.';
    const axiosError = new AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        data: { message: errorMessage },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        // eslint-disable-next-line
        config: {} as any,
      },
    );

    // eslint-disable-next-line
    axiosError.response = { data: { message: errorMessage } } as any;

    mockAxios.post.mockRejectedValueOnce(axiosError);

    const { result } = renderHook(() => useSignin());

    await act(async() => {
      await result.current.signin({
        email: 'test@example.com',
        password: 'Password123!',
      });
    });

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
      expect(mockAxios.post).toHaveBeenCalled();
    });
  });
});
