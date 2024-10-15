import { describe, it, vi, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import AuthGuard from './AuthGuard';
import { useAuthStore } from '../../store/auth/useAuthStore';

vi.mock('../../store/auth/useAuthStore');
vi.mock('react-router-dom', async() => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('AuthGuard', () => {
  it('should redirect to /signin if no user is authenticated', () => {
    const navigate = vi.fn();
    (useAuthStore as jest.Mock).mockReturnValue({ user: null });
    (useNavigate as jest.Mock).mockReturnValue(
      navigate,
    );

    render(
      <MemoryRouter initialEntries={['/application']}>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </MemoryRouter>,
    );

    expect(navigate).toHaveBeenCalledWith('/signin');
  });

  it('should render children if a user is authenticated', () => {
    (useAuthStore as jest.Mock).mockReturnValue({ user: { name: 'John Doe' } });

    const { getByText } = render(
      <MemoryRouter initialEntries={['/application']}>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </MemoryRouter>,
    );

    expect(getByText('Protected Content')).toBeInTheDocument();
  });
});
