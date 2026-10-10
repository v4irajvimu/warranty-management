import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
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

function renderShell(
  role: Role | null,
  path = '/',
  displayName = 'Ada Lovelace',
) {
  const value: AuthContextValue = {
    user: { uid: 'uid-1' } as User,
    profile: role
      ? {
          uid: 'uid-1',
          displayName,
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

  it('shows U initials when the display name is blank', () => {
    renderShell('user', '/', '   ');
    expect(screen.getByText('U')).toBeTruthy();
  });

  it('shows U initials without a profile', () => {
    renderShell(null);
    expect(screen.getByText('U')).toBeTruthy();
  });

  it('opens and closes the profile drawer from the avatar', async () => {
    renderShell('admin');
    expect(screen.queryByText('ada@example.com')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Open profile' }));
    const drawer = await screen.findByRole('presentation');
    expect(within(drawer).getByText('ada@example.com')).toBeTruthy();

    fireEvent.keyDown(drawer, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByText('ada@example.com')).toBeNull();
    });
  });

  it('opens the mobile navigation and closes it after navigating', async () => {
    renderShell('user');

    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    const mobileNav = await screen.findByRole('presentation');
    fireEvent.click(within(mobileNav).getByRole('link', { name: 'Reports' }));

    expect(await screen.findByText('Reports body')).toBeTruthy();
    await waitFor(() => {
      expect(screen.queryByRole('presentation')).toBeNull();
    });
  });
});
