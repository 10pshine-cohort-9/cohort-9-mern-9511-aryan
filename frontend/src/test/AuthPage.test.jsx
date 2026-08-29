import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import AuthPage from '../pages/AuthPage';

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
    signup: vi.fn(),
    isAuthenticated: false,
  }),
}));

describe('AuthPage Component Unit Tests', () => {
  it('renders Sign In tab by default with email and password fields', () => {
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    expect(screen.getByText('10P Notes Application')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.queryByText('Full Name')).not.toBeInTheDocument();
  });

  it('switches to Sign Up tab when Sign Up button is clicked', () => {
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    const tabs = screen.getAllByRole('button');
    const signUpTab = tabs.find((btn) => btn.textContent.trim() === 'Sign Up');
    fireEvent.click(signUpTab);

    expect(screen.getByText('Full Name')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password')).toBeInTheDocument();
  });

  it('shows error validation message when submitting empty form', () => {
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    const signInBtns = screen.getAllByRole('button', { name: /Sign In/i });
    const submitBtn = signInBtns[signInBtns.length - 1];
    fireEvent.click(submitBtn);

    expect(screen.getByText('Please fill in all required fields.')).toBeInTheDocument();
  });
});
