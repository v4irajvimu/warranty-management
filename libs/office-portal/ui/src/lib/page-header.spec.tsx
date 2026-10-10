import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { PageHeader } from './page-header';
import { theme } from './theme';

describe('PageHeader', () => {
  it('renders the title, subtitle, and action', () => {
    render(
      <ThemeProvider theme={theme}>
        <PageHeader
          title="Reports"
          subtitle="Latest activity"
          action={<button type="button">Export</button>}
        />
      </ThemeProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Reports' })).toBeTruthy();
    expect(screen.getByText('Latest activity')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Export' })).toBeTruthy();
  });
});
