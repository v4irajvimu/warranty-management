import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@warranty-management/office-portal-ui';
import { ReportsPage } from './reports-page';

describe('ReportsPage', () => {
  it('lists the dummy reports', () => {
    render(
      <ThemeProvider theme={theme}>
        <ReportsPage />
      </ThemeProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Reports' })).toBeTruthy();
    expect(screen.getByText('Weekly activity summary')).toBeTruthy();
    expect(screen.getByText('Updated yesterday')).toBeTruthy();
  });
});
