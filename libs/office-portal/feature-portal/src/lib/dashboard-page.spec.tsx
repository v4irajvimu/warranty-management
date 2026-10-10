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
import { DashboardPage } from './dashboard-page';

function renderDashboard(role: Role) {
  const value: AuthContextValue = {
    user: { uid: 'uid-1' } as User,
    profile: {
      uid: 'uid-1',
      displayName: 'Ada Lovelace',
      email: 'ada@example.com',
      role,
    },
    loading: false,
    configured: true,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  };

  return render(
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={value}>
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      </AuthContext.Provider>
    </ThemeProvider>,
  );
}

describe('DashboardPage', () => {
  it('shows admin quick actions', () => {
    renderDashboard('admin');
    expect(screen.getByText(/Welcome back, Ada Lovelace/)).toBeTruthy();
    expect(screen.getByText('128')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Manage Users' })).toBeTruthy();
  });

  it('hides user management from a regular user', () => {
    renderDashboard('user');
    expect(screen.queryByRole('button', { name: 'Manage Users' })).toBeNull();
    expect(screen.getByRole('button', { name: 'View Reports' })).toBeTruthy();
  });
});
