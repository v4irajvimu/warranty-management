import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
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
});
