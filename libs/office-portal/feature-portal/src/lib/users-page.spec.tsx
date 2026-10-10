import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@warranty-management/office-portal-ui';
import { UsersPage } from './users-page';

describe('UsersPage', () => {
  it('lists the dummy portal members', () => {
    render(
      <ThemeProvider theme={theme}>
        <UsersPage />
      </ThemeProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Users' })).toBeTruthy();
    expect(screen.getByText('Alex Morgan')).toBeTruthy();
    expect(screen.getByText('sam@example.com')).toBeTruthy();
  });
});
