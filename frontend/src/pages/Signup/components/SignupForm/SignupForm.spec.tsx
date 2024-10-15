import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SignupForm from './SignupForm';

describe('SignupForm', () => {
  const mockOnSubmit = vi.fn();

  it('should render the name, email, password, and confirm password fields', () => {
    render(<SignupForm isLoading={false} onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText('Enter your name');
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = document.querySelector('input[name="password"]');
    const confirmPasswordInput = screen.getByLabelText(
      'Re-enter your password to confirm',
    );
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('should call onSubmit with form data when submitted', async() => {
    render(<SignupForm isLoading={false} onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByRole('textbox', { name: /name/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = document.querySelector('input[name="password"]');
    const confirmPasswordInput = document.querySelector(
      'input[name="confirmPassword"]',
    );
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    // Update the input values using fireEvent.change
    act(() => {
      fireEvent.change(nameInput, {
        target: { value: 'John Doe' },
      });
      fireEvent.change(emailInput, {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(passwordInput as HTMLInputElement, {
        target: { value: 'Password123!' },
      });
      fireEvent.change(confirmPasswordInput as HTMLInputElement, {
        target: { value: 'Password123!' },
      });

      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
    });
  });

  it('should disable the submit button when isLoading is true', () => {
    render(<SignupForm isLoading={true} onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /sign up/i });

    expect(submitButton).toBeDisabled();
  });

  it('should show loading spinner when isLoading is true', () => {
    render(<SignupForm isLoading={true} onSubmit={mockOnSubmit} />);

    const spinner = screen.getByRole('progressbar');

    expect(spinner).toBeInTheDocument();
  });
});
