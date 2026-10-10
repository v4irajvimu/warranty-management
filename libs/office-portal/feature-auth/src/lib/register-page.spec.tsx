import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { User } from 'firebase/auth';
import {
  AuthContext,
  type AuthContextValue,
} from '@warranty-management/office-portal-data-access';
import { theme } from '@warranty-management/office-portal-ui';
import { RegisterPage } from './register-page';

function renderRegister(overrides: Partial<AuthContextValue> = {}) {
  const value: AuthContextValue = {
    user: null,
    profile: null,
    loading: false,
    configured: true,
    login: vi.fn(),
    register: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn(),
    ...overrides,
  };

  return {
    value,
    ...render(
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={value}>
          <MemoryRouter initialEntries={['/register']}>
            <Routes>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<p>Login page</p>} />
              <Route path="/" element={<p>Dashboard home</p>} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      </ThemeProvider>,
    ),
  };
}

describe('RegisterPage', () => {
  it('requires a password of at least 6 characters', () => {
    const { value } = renderRegister();
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Ada Lovelace' },
    });
    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: 'ada@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(
      screen.getByText('Password must be at least 6 characters.'),
    ).toBeTruthy();
    expect(value.register).not.toHaveBeenCalled();
  });

  it('registers and opens the dashboard', async () => {
    const register = vi.fn().mockResolvedValue(undefined);
    renderRegister({ register });

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Ada Lovelace' },
    });
    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: 'ada@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'secret' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(register).toHaveBeenCalledWith(
      'Ada Lovelace',
      'ada@example.com',
      'secret',
    );
    expect(await screen.findByText('Dashboard home')).toBeTruthy();
  });

  it('links back to sign in', () => {
    renderRegister();
    fireEvent.click(
      screen.getByRole('link', { name: 'Already have an account? Sign in' }),
    );
    expect(screen.getByText('Login page')).toBeTruthy();
  });

  it('explains a Firestore permission failure', async () => {
    const register = vi
      .fn()
      .mockRejectedValue(new Error('Missing or insufficient permissions.'));
    renderRegister({ register });

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Ada Lovelace' },
    });
    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: 'ada@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'secret' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(
      await screen.findByText(/Could not create your Firestore profile/),
    ).toBeTruthy();
  });

  it('treats a permission-denied error as a Firestore rules problem', async () => {
    renderRegister({
      register: vi.fn().mockRejectedValue(new Error('PERMISSION_DENIED')),
    });

    fillAndSubmit();

    expect(
      await screen.findByText(/Could not create your Firestore profile/),
    ).toBeTruthy();
  });

  it('shows a cleaned Firebase error', async () => {
    renderRegister({
      register: vi
        .fn()
        .mockRejectedValue(
          new Error(
            'Firebase: Email already in use (auth/email-already-in-use).',
          ),
        ),
    });

    fillAndSubmit();

    expect(await screen.findByText('Email already in use')).toBeTruthy();
  });

  it('falls back to a generic message for an empty Firebase error', async () => {
    renderRegister({
      register: vi
        .fn()
        .mockRejectedValue(new Error('Firebase: (auth/unknown).')),
    });

    fillAndSubmit();

    expect(await screen.findByText('Unable to register.')).toBeTruthy();
  });

  it('shows a generic message for a non-Error failure', async () => {
    renderRegister({ register: vi.fn().mockRejectedValue('offline') });

    fillAndSubmit();

    expect(
      await screen.findByText('Unable to register. Try again.'),
    ).toBeTruthy();
  });

  it('shows a loading screen while auth is loading', () => {
    renderRegister({ loading: true });
    expect(screen.getByText('Setting up your account…')).toBeTruthy();
  });

  it('redirects when a profile is already loaded', () => {
    renderRegister({
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
});

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText(/full name/i), {
    target: { value: 'Ada Lovelace' },
  });
  fireEvent.change(screen.getByLabelText(/^email/i), {
    target: { value: 'ada@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/^password/i), {
    target: { value: 'secret' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
}
