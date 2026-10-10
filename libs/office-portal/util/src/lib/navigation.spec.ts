import {
  getDashboardActionsForRole,
  getNavItemsForRole,
  getPageTitle,
} from './navigation';

describe('navigation', () => {
  it('returns admin and user routes for an admin', () => {
    expect(getNavItemsForRole('admin').map((item) => item.path)).toEqual([
      '/',
      '/users',
      '/reports',
      '/settings',
    ]);
  });

  it('hides the users route from a regular user', () => {
    expect(getNavItemsForRole('user').map((item) => item.path)).toEqual([
      '/',
      '/reports',
      '/settings',
    ]);
  });

  it('filters dashboard actions by role', () => {
    expect(
      getDashboardActionsForRole('admin').map((item) => item.label),
    ).toEqual(['Manage Users', 'View Reports', 'Open Settings']);
    expect(
      getDashboardActionsForRole('user').map((item) => item.label),
    ).toEqual(['View Reports', 'Open Settings']);
  });

  it('resolves page titles from the pathname', () => {
    expect(getPageTitle('/')).toBe('Dashboard');
    expect(getPageTitle('/users')).toBe('Users');
    expect(getPageTitle('/reports/weekly')).toBe('Reports');
    expect(getPageTitle('/unknown')).toBe('Portal');
  });
});
