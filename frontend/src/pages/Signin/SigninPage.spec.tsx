import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SigninPage from './SigninPage';
import { useSignin } from './hooks/useSignin';
import { useAuthStore } from '../../store/auth/useAuthStore';

// Mock hooks
vi.mock('./hooks/useSignin');
vi.mock('../../store/auth/useAuthStore');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async() => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SigninPage', () => {
  const mockSignin = vi.fn();
  const mockSetAuth = vi.fn();

  beforeEach(() => {
    (useSignin as jest.Mock).mockReturnValue({
      signin: mockSignin,
      isLoading: false,
      error: null,
    });

    (useAuthStore as jest.Mock).mockReturnValue({
      setAuth: mockSetAuth,
    });

    vi.clearAllMocks();
  });

  it('should render the SigninPage components', () => {
    render(
      <BrowserRouter>
        <SigninPage />
      </BrowserRouter>,
    );

    const heading = screen.getByRole('heading', { name: /sign in/i });
    const signupLink = screen.getByRole('link', {
      name: /navigate to sign up page/i,
    });

    expect(heading).toBeInTheDocument();
    expect(signupLink).toBeInTheDocument();
  });

  it('should display an error message when there is an error', () => {
    (useSignin as jest.Mock).mockReturnValue({
      signin: mockSignin,
      isLoading: false,
      error: 'Invalid email or password',
    });

    render(
      <BrowserRouter>
        <SigninPage />
      </BrowserRouter>,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Invalid email or password');
  });

  it('should call signin with form data and navigate to application page on success', async() => {
    const mockResponse = {
      user: { name: 'John Doe', email: 'test@example.com' },
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    };
    mockSignin.mockResolvedValueOnce(mockResponse);

    render(
      <BrowserRouter>
        <SigninPage />
      </BrowserRouter>,
    );

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = document.querySelector('input[name="password"]');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput as HTMLInputElement, {
      target: { value: 'Password123!' },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(mockSetAuth).toHaveBeenCalledWith(
        mockResponse.user,
        mockResponse.accessToken,
        mockResponse.refreshToken,
      );

      expect(mockNavigate).toHaveBeenCalledWith('/application');
    });
  });

  it('should redirect to the signup page when the Sign Up link is clicked', () => {
    render(
      <BrowserRouter>
        <SigninPage />
      </BrowserRouter>,
    );

    const signupLink = screen.getByRole('link', {
      name: /navigate to sign up page/i,
    });

    fireEvent.click(signupLink);

    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

  it('should disable the submit button when loading', () => {
    (useSignin as jest.Mock).mockReturnValue({
      signin: mockSignin,
      isLoading: true,
      error: null,
    });

    render(
      <BrowserRouter>
        <SigninPage />
      </BrowserRouter>,
    );

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton).toBeDisabled();
  });
});
