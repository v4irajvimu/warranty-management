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
import { AppShell } from './app-shell';

function renderShell(role: Role, path = '/') {
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
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<p>Dashboard body</p>} />
              <Route path="reports" element={<p>Reports body</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    </ThemeProvider>,
  );
}

describe('AppShell', () => {
  it('shows the page title, initials, and nested page', () => {
    renderShell('user');
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
    expect(screen.getByText('AL')).toBeTruthy();
    expect(screen.getByText('Dashboard body')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Open profile' })).toBeTruthy();
  });

  it('titles the reports route', () => {
    renderShell('admin', '/reports');
    expect(screen.getByText('Reports body')).toBeTruthy();
    expect(screen.getAllByText('Reports').length).toBeGreaterThan(0);
  });
});
