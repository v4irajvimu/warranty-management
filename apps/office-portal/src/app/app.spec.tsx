import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { MemoryRouter } from 'react-router-dom';
import type { User } from 'firebase/auth';
import {
  AuthContext,
  type AuthContextValue,
} from '@warranty-management/office-portal-data-access';
import { theme } from '@warranty-management/office-portal-ui';
import type { Role } from '@warranty-management/office-portal-util';
import { AppRouter } from './app-router';

function authValue(
  role: Role | null,
  overrides: Partial<AuthContextValue> = {},
): AuthContextValue {
  return {
    user: role ? ({ uid: 'uid-1' } as User) : null,
    profile: role
      ? {
          uid: 'uid-1',
          displayName: 'Ada Lovelace',
          email: 'ada@example.com',
          role,
        }
      : null,
    loading: false,
    configured: true,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  };
}

function renderAt(path: string, value: AuthContextValue) {
  return render(
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={value}>
        <MemoryRouter initialEntries={[path]}>
          <AppRouter />
        </MemoryRouter>
      </AuthContext.Provider>
    </ThemeProvider>,
  );
}

describe('AppRouter', () => {
  it('sends a guest to login', () => {
    renderAt('/', authValue(null, { user: null, profile: null }));
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeTruthy();
  });

  it('sends a regular user away from the users page', () => {
    renderAt('/users', authValue('user'));
    expect(
      screen.getByRole('heading', { level: 1, name: 'Dashboard' }),
    ).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Users' })).toBeNull();
  });

  it('lets an admin open the users page', () => {
    renderAt('/users', authValue('admin'));
    expect(
      screen.getByRole('heading', { level: 1, name: 'Users' }),
    ).toBeTruthy();
    expect(screen.getByText('Alex Morgan')).toBeTruthy();
  });
});
