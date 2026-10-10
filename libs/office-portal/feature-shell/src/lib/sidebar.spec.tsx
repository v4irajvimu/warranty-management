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
import { Sidebar } from './sidebar';

function renderSidebar(role: Role | null, path = '/') {
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
        <MemoryRouter initialEntries={[path]}>
          <Sidebar mobileOpen={false} onClose={vi.fn()} />
        </MemoryRouter>
      </AuthContext.Provider>
    </ThemeProvider>,
  );
}

describe('Sidebar', () => {
  it('shows the users link to admins', () => {
    renderSidebar('admin');
    expect(
      screen.getAllByRole('link', { name: 'Users' }).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('Admin Portal').length).toBeGreaterThan(0);
  });

  it('hides the users link from regular users', () => {
    renderSidebar('user');
    expect(screen.queryAllByRole('link', { name: 'Users' })).toHaveLength(0);
    expect(
      screen.getAllByRole('link', { name: 'Reports' }).length,
    ).toBeGreaterThan(0);
  });

  it('highlights the active nested route', () => {
    renderSidebar('admin', '/reports');
    const [reportsLink] = screen.getAllByRole('link', { name: 'Reports' });
    const [dashboardLink] = screen.getAllByRole('link', { name: 'Dashboard' });
    expect(reportsLink.className).toContain('Mui-selected');
    expect(dashboardLink.className).not.toContain('Mui-selected');
  });

  it('shows no links without a profile', () => {
    renderSidebar(null);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
