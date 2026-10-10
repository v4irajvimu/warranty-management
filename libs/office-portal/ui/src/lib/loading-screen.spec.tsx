import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { LoadingScreen } from './loading-screen';
import { theme } from './theme';

describe('LoadingScreen', () => {
  it('shows the default message', () => {
    render(
      <ThemeProvider theme={theme}>
        <LoadingScreen />
      </ThemeProvider>,
    );
    expect(screen.getByText('Loading…')).toBeTruthy();
  });

  it('shows a custom message', () => {
    render(
      <ThemeProvider theme={theme}>
        <LoadingScreen message="Checking your session…" />
      </ThemeProvider>,
    );
    expect(screen.getByText('Checking your session…')).toBeTruthy();
  });
});
