import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { AuthLayout } from './auth-layout';
import { theme } from './theme';

function renderLayout(configured: boolean) {
  return render(
    <ThemeProvider theme={theme}>
      <AuthLayout
        title="Welcome back"
        subtitle="Sign in with your email and password."
        illustration="/login.svg"
        illustrationAlt="Secure login illustration"
        configured={configured}
      >
        <p>Form fields</p>
      </AuthLayout>
    </ThemeProvider>,
  );
}

describe('AuthLayout', () => {
  it('warns when Firebase is not configured', () => {
    renderLayout(false);
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeTruthy();
    expect(screen.getByText(/Firebase is not configured/)).toBeTruthy();
    expect(screen.getByText('Form fields')).toBeTruthy();
  });

  it('hides the warning when Firebase is configured', () => {
    renderLayout(true);
    expect(screen.queryByText(/Firebase is not configured/)).toBeNull();
  });
});
