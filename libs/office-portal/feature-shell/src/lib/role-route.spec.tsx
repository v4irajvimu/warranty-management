import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { User } from 'firebase/auth';
import {
  AuthContext,
  type AuthContextValue,
} from '@warranty-management/office-portal-data-access';
import { theme } from '@warranty-management/office-portal-ui';
import type { Role } from '@warranty-management/office-portal-util';
import { RoleRoute } from './role-route';

function renderRole(role: Role | null) {
  const value: AuthContextValue = {
    user: { uid: 'uid-1' } as User,
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
  };

  return render(
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={value}>
        <MemoryRouter initialEntries={['/users']}>
          <Routes>
            <Route
              path="/users"
              element={
                <RoleRoute roles={['admin']}>
                  <p>Users page</p>
                </RoleRoute>
              }
            />
            <Route path="/" element={<p>Home</p>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    </ThemeProvider>,
  );
}

describe('RoleRoute', () => {
  it('allows an admin through', () => {
    renderRole('admin');
    expect(screen.getByText('Users page')).toBeTruthy();
  });

  it('sends a regular user home', () => {
    renderRole('user');
    expect(screen.getByText('Home')).toBeTruthy();
  });
});
