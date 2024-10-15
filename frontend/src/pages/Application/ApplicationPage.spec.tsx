import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ApplicationPage from './ApplicationPage';
import { useAuthStore } from '../../store/auth/useAuthStore';

vi.mock('../../store/auth/useAuthStore');

describe('ApplicationPage', () => {
  it('should render the welcome heading', () => {
    (useAuthStore as jest.Mock).mockReturnValue({ user: null });

    render(<ApplicationPage />);

    const headingElement = screen.getByRole('heading', {
      name: /Welcome to the Application/i,
      level: 1,
    });
    expect(headingElement).toBeInTheDocument();
  });

  it('should render login message if user is not logged in', () => {
    (useAuthStore as jest.Mock).mockReturnValue({ user: null });

    render(<ApplicationPage />);

    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveTextContent(
      'You are not logged in. Please sign in to access the application.',
    );
  });

  it('should render user information if user is logged in', () => {
    const mockUser = { name: 'John Doe', email: 'john.doe@example.com' };
    (useAuthStore as jest.Mock).mockReturnValue({ user: mockUser });

    render(<ApplicationPage />);

    const userGreeting = screen.getByRole('heading', {
      name: `Hello, ${mockUser.name}!`,
      level: 2,
    });
    expect(userGreeting).toBeInTheDocument();

    const userEmail = screen.getByLabelText(`Email: ${mockUser.email}`);
    expect(userEmail).toBeInTheDocument();
  });
});
