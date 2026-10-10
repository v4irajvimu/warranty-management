import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import type { User } from 'firebase/auth';
import {
  AuthContext,
  type AuthContextValue,
} from '@warranty-management/office-portal-data-access';
import { theme } from '@warranty-management/office-portal-ui';
import { ProfilePanel } from './profile-panel';

describe('ProfilePanel', () => {
  it('shows the signed-in profile and signs out', () => {
    const logout = vi.fn();
    const value: AuthContextValue = {
      user: { uid: 'uid-1' } as User,
      profile: {
        uid: 'uid-1',
        displayName: 'Ada Lovelace',
        email: 'ada@example.com',
        role: 'admin',
      },
      loading: false,
      configured: true,
      login: vi.fn(),
      register: vi.fn(),
      logout,
    };

    render(
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={value}>
          <ProfilePanel open onClose={vi.fn()} />
        </AuthContext.Provider>
      </ThemeProvider>,
    );

    expect(screen.getByText('Ada Lovelace')).toBeTruthy();
    expect(screen.getByText('ada@example.com')).toBeTruthy();
    expect(screen.getByText('Admin')).toBeTruthy();
    expect(screen.getByText(/Full admin portal access/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(logout).toHaveBeenCalled();
  });
});
