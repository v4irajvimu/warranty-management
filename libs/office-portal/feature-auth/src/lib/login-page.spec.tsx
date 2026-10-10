import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { User } from 'firebase/auth';
import {
  AuthContext,
  type AuthContextValue,
} from '@warranty-management/office-portal-data-access';
import { theme } from '@warranty-management/office-portal-ui';
import { LoginPage } from './login-page';

function renderLogin(overrides: Partial<AuthContextValue> = {}) {
  const value: AuthContextValue = {
    user: null,
    profile: null,
    loading: false,
    configured: true,
    login: vi.fn().mockResolvedValue(undefined),
    register: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  };

  return {
    value,
    ...render(
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={value}>
          <MemoryRouter initialEntries={['/login']}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<p>Register page</p>} />
              <Route path="/" element={<p>Dashboard home</p>} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      </ThemeProvider>,
    ),
  };
}

describe('LoginPage', () => {
  it('shows the unconfigured warning and disables sign-in', () => {
    renderLogin({ configured: false });
    expect(screen.getByText(/Firebase is not configured/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sign in' })).toHaveProperty(
      'disabled',
      true,
    );
  });

  it('links to registration', () => {
    renderLogin();
    fireEvent.click(
      screen.getByRole('link', { name: 'Need an account? Register' }),
    );
    expect(screen.getByText('Register page')).toBeTruthy();
  });

  it('shows a cleaned Firebase error', async () => {
    const login = vi
      .fn()
      .mockRejectedValue(
        new Error('Firebase: wrong (auth/invalid-credential).'),
      );
    renderLogin({ login });

    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: 'ada@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'secret' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('wrong')).toBeTruthy();
  });

  it('redirects when a profile is already loaded', () => {
    renderLogin({
      user: { uid: 'uid-1' } as User,
      profile: {
        uid: 'uid-1',
        displayName: 'Ada Lovelace',
        email: 'ada@example.com',
        role: 'user',
      },
    });
    expect(screen.getByText('Dashboard home')).toBeTruthy();
  });

  it('shows a loading screen while the profile is loading', () => {
    renderLogin({ loading: true });
    expect(screen.getByText('Loading your profile…')).toBeTruthy();
  });
});
