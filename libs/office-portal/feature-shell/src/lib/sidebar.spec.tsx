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

function renderSidebar(role: Role) {
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
});
