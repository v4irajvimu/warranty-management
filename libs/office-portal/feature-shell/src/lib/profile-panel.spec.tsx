import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import type { User } from 'firebase/auth';
import {
  AuthContext,
  type AuthContextValue,
} from '@warranty-management/office-portal-data-access';
import { theme } from '@warranty-management/office-portal-ui';
import type { UserProfile } from '@warranty-management/office-portal-util';
import { ProfilePanel } from './profile-panel';

function renderPanel(profile: UserProfile | null, logout = vi.fn()) {
  const value: AuthContextValue = {
    user: { uid: 'uid-1' } as User,
    profile,
    loading: false,
    configured: true,
    login: vi.fn(),
    register: vi.fn(),
    logout,
  };

  return render(
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={value}>
        <ProfilePanel open onClose={vi.fn()} />
      </AuthContext.Provider>
    </ThemeProvider>,
  );
}

describe('ProfilePanel', () => {
  it('shows the signed-in profile and signs out', () => {
    const logout = vi.fn();
    renderPanel(
      {
        uid: 'uid-1',
        displayName: 'Ada Lovelace',
        email: 'ada@example.com',
        role: 'admin',
      },
      logout,
    );

    expect(screen.getByText('Ada Lovelace')).toBeTruthy();
    expect(screen.getByText('ada@example.com')).toBeTruthy();
    expect(screen.getByText('Admin')).toBeTruthy();
    expect(screen.getByText(/Full admin portal access/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(logout).toHaveBeenCalled();
  });

  it('describes standard access for a regular user', () => {
    renderPanel({
      uid: 'uid-2',
      displayName: '',
      email: 'grace@example.com',
      role: 'user',
    });

    expect(screen.getByText('U')).toBeTruthy();
    expect(screen.getByText('User')).toBeTruthy();
    expect(screen.getByText(/Standard portal access/)).toBeTruthy();
  });

  it('renders no profile content without a profile', () => {
    renderPanel(null);
    expect(screen.queryByText('Profile')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Sign out' })).toBeNull();
  });
});
