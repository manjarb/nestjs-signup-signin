import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SignupPage from './SignupPage';
import { useSignup } from './hooks/useSignup';
import { useAuthStore } from '../../store/auth/useAuthStore';

// Mock hooks
vi.mock('./hooks/useSignup');
vi.mock('../../store/auth/useAuthStore');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async() => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SignupPage', () => {
  const mockSignup = vi.fn();
  const mockSetAuth = vi.fn();

  beforeEach(() => {
    (useSignup as jest.Mock).mockReturnValue({
      signup: mockSignup,
      isLoading: false,
      error: null,
    });

    (useAuthStore as jest.Mock).mockReturnValue({
      setAuth: mockSetAuth,
    });

    vi.clearAllMocks();
  });

  it('should render the SignupPage components', () => {
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>,
    );

    const heading = screen.getByRole('heading', { name: /sign up/i });
    const signinLink = screen.getByRole('link', {
      name: /navigate to sign in page/i,
    });

    expect(heading).toBeInTheDocument();
    expect(signinLink).toBeInTheDocument();
  });

  it('should display an error message when there is an error', () => {
    (useSignup as jest.Mock).mockReturnValue({
      signup: mockSignup,
      isLoading: false,
      error: 'Invalid signup details',
    });

    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Invalid signup details');
  });

  it('should call signup with form data and navigate to application page on success', async() => {
    const mockResponse = {
      user: { name: 'John Doe', email: 'test@example.com' },
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    };
    mockSignup.mockResolvedValueOnce(mockResponse);

    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>,
    );

    const nameInput = screen.getByRole('textbox', { name: /name/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = document.querySelector('input[name="password"]');
    const confirmPasswordInput = document.querySelector(
      'input[name="confirmPassword"]',
    );
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput as HTMLInputElement, {
      target: { value: 'Password123!' },
    });
    fireEvent.change(confirmPasswordInput as HTMLInputElement, {
      target: { value: 'Password123!' },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });

      expect(mockSetAuth).toHaveBeenCalledWith(
        mockResponse.user,
        mockResponse.accessToken,
        mockResponse.refreshToken,
      );

      expect(mockNavigate).toHaveBeenCalledWith('/application');
    });
  });

  it('should redirect to the signin page when the Sign In link is clicked', () => {
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>,
    );

    const signinLink = screen.getByRole('link', {
      name: /navigate to sign in page/i,
    });

    fireEvent.click(signinLink);

    expect(mockNavigate).toHaveBeenCalledWith('/signin');
  });

  it('should disable the submit button when loading', () => {
    (useSignup as jest.Mock).mockReturnValue({
      signup: mockSignup,
      isLoading: true,
      error: null,
    });

    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>,
    );

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    expect(submitButton).toBeDisabled();
  });
});
