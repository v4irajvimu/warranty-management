import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import type { User } from 'firebase/auth';
import {
  AuthContext,
  type AuthContextValue,
} from '@warranty-management/office-portal-data-access';
import { theme } from '@warranty-management/office-portal-ui';
import type { UserProfile } from '@warranty-management/office-portal-util';
import { SettingsPage } from './settings-page';

function renderSettings(profile: UserProfile | null) {
  const value: AuthContextValue = {
    user: { uid: 'uid-1' } as User,
    profile,
    loading: false,
    configured: true,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  };

  return render(
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={value}>
        <SettingsPage />
      </AuthContext.Provider>
    </ThemeProvider>,
  );
}

describe('SettingsPage', () => {
  it('shows the signed-in profile as read-only fields', () => {
    renderSettings({
      uid: 'uid-1',
      displayName: 'Ada Lovelace',
      email: 'ada@example.com',
      role: 'admin',
    });

    expect(screen.getByLabelText('Display name')).toHaveProperty(
      'value',
      'Ada Lovelace',
    );
    expect(screen.getByLabelText('Email')).toHaveProperty(
      'value',
      'ada@example.com',
    );
    expect(screen.getByLabelText('Role')).toHaveProperty('value', 'admin');
    expect(screen.getByLabelText('Email me weekly summaries')).toBeTruthy();
  });

  it('leaves the fields empty without a profile', () => {
    renderSettings(null);

    expect(screen.getByLabelText('Display name')).toHaveProperty('value', '');
    expect(screen.getByLabelText('Email')).toHaveProperty('value', '');
    expect(screen.getByLabelText('Role')).toHaveProperty('value', '');
  });
});
