import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Provider } from 'jotai';
import { useAuthStore } from './useAuthStore';
import { User } from '../../interfaces/auth.interface';

describe('useAuthStore', () => {
  const mockUser: User = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    _id: '12345',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const mockAccessToken = 'mockAccessToken';
  const mockRefreshToken = 'mockRefreshToken';

  it('should initialize with null values', () => {
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: Provider,
    });

    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.refreshToken).toBeNull();
  });

  it('should set user, access token, and refresh token when setAuth is called', () => {
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: Provider,
    });

    act(() => {
      result.current.setAuth(mockUser, mockAccessToken, mockRefreshToken);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.accessToken).toBe(mockAccessToken);
    expect(result.current.refreshToken).toBe(mockRefreshToken);
  });

  it('should clear user, access token, and refresh token when clearAuth is called', () => {
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: Provider,
    });

    // First, set auth values
    act(() => {
      result.current.setAuth(mockUser, mockAccessToken, mockRefreshToken);
    });

    // Then, clear auth values
    act(() => {
      result.current.clearAuth();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.refreshToken).toBeNull();
  });
});
