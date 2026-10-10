import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { User } from 'firebase/auth';
import {
  AuthContext,
  type AuthContextValue,
} from '@warranty-management/office-portal-data-access';
import { theme } from '@warranty-management/office-portal-ui';
import type {
  Role,
  UserProfile,
} from '@warranty-management/office-portal-util';
import { ProtectedRoute } from './protected-route';

function authValue(
  overrides: Partial<AuthContextValue> = {},
): AuthContextValue {
  return {
    user: { uid: 'uid-1' } as User,
    profile: {
      uid: 'uid-1',
      displayName: 'Ada Lovelace',
      email: 'ada@example.com',
      role: 'user',
    },
    loading: false,
    configured: true,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  };
}

function renderRoute(value: AuthContextValue) {
  return render(
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={value}>
        <MemoryRouter initialEntries={['/reports']}>
          <Routes>
            <Route path="/login" element={<p>Login page</p>} />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <p>Protected content</p>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    </ThemeProvider>,
  );
}

describe('ProtectedRoute', () => {
  it('sends guests to login when Firebase is not configured', () => {
    renderRoute(authValue({ configured: false, user: null, profile: null }));
    expect(screen.getByText('Login page')).toBeTruthy();
  });

  it('shows a loading message while the session is checked', () => {
    renderRoute(authValue({ loading: true }));
    expect(screen.getByText('Checking your session…')).toBeTruthy();
  });

  it('sends signed-out visitors to login', () => {
    renderRoute(authValue({ user: null, profile: null }));
    expect(screen.getByText('Login page')).toBeTruthy();
  });

  it('explains a missing Firestore profile and can sign out', () => {
    const logout = vi.fn();
    renderRoute(authValue({ profile: null, logout }));
    expect(screen.getByText(/no Firestore profile was found/)).toBeTruthy();
    screen.getByRole('button', { name: 'Sign out' }).click();
    expect(logout).toHaveBeenCalled();
  });

  it('renders children for a signed-in profile', () => {
    renderRoute(
      authValue({
        profile: {
          uid: 'uid-1',
          displayName: 'Ada Lovelace',
          email: 'ada@example.com',
          role: 'admin' satisfies Role,
        } satisfies UserProfile,
      }),
    );
    expect(screen.getByText('Protected content')).toBeTruthy();
  });
});
