import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SigninForm from './SigninForm';

describe('SigninForm', () => {
  const mockOnSubmit = vi.fn();

  it('should render the email and password fields', () => {
    render(<SigninForm isLoading={false} onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText('Enter your email address');
    const passwordInput = screen.getByLabelText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('should call onSubmit with form data when submitted', async() => {
    const mockOnSubmit = vi.fn();
    render(<SigninForm isLoading={false} onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = document.querySelector('input[name="password"]');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Update the input values using fireEvent.change
    act(() => {
      fireEvent.change(emailInput, {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(passwordInput as HTMLInputElement, {
        target: { value: 'Password123!' },
      });

      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
      });
    });
  });

  it('should disable the submit button when isLoading is true', () => {
    render(<SigninForm isLoading={true} onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });

    expect(submitButton).toBeDisabled();
  });

  it('should show loading spinner when isLoading is true', () => {
    render(<SigninForm isLoading={true} onSubmit={mockOnSubmit} />);

    const spinner = screen.getByRole('progressbar');

    expect(spinner).toBeInTheDocument();
  });
});
