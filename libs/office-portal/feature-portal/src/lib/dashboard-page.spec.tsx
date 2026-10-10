import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { User } from 'firebase/auth';
import {
  AuthContext,
  type AuthContextValue,
} from '@warranty-management/office-portal-data-access';
import { theme } from '@warranty-management/office-portal-ui';
import type { Role } from '@warranty-management/office-portal-util';
import { DashboardPage } from './dashboard-page';

function renderDashboard(role: Role | null) {
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
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/reports" element={<p>Reports route</p>} />
          </Routes>
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

  it('navigates when a quick action is clicked', () => {
    renderDashboard('user');
    fireEvent.click(screen.getByRole('button', { name: 'View Reports' }));
    expect(screen.getByText('Reports route')).toBeTruthy();
  });

  it('shows a generic greeting and no actions without a profile', () => {
    renderDashboard(null);
    expect(screen.getByText(/Welcome back, user\./)).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
