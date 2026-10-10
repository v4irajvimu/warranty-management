import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { StatCard } from './stat-card';
import { theme } from './theme';

function StatIcon() {
  return <span>icon</span>;
}

describe('StatCard', () => {
  it('renders the metric, subtitle, and icon', () => {
    render(
      <ThemeProvider theme={theme}>
        <StatCard
          title="Active users"
          value="128"
          subtitle="+12 this week"
          icon={StatIcon}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('Active users')).toBeTruthy();
    expect(screen.getByText('128')).toBeTruthy();
    expect(screen.getByText('+12 this week')).toBeTruthy();
    expect(screen.getByText('icon')).toBeTruthy();
  });
});
