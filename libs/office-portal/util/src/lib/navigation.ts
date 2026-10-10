import type { Role } from './user';

export interface PortalRoute {
  label: string;
  path: string;
  roles: Role[];
}

export interface DashboardAction {
  label: string;
  path: string;
  roles: Role[];
}

export const portalRoutes: PortalRoute[] = [
  { label: 'Dashboard', path: '/', roles: ['admin', 'user'] },
  { label: 'Users', path: '/users', roles: ['admin'] },
  { label: 'Reports', path: '/reports', roles: ['admin', 'user'] },
  { label: 'Settings', path: '/settings', roles: ['admin', 'user'] },
];

export const dashboardActions: DashboardAction[] = [
  { label: 'Manage Users', path: '/users', roles: ['admin'] },
  { label: 'View Reports', path: '/reports', roles: ['admin', 'user'] },
  { label: 'Open Settings', path: '/settings', roles: ['admin', 'user'] },
];

export function getNavItemsForRole(role: Role): PortalRoute[] {
  return portalRoutes.filter((item) => item.roles.includes(role));
}

export function getDashboardActionsForRole(role: Role): DashboardAction[] {
  return dashboardActions.filter((action) => action.roles.includes(role));
}

export function getPageTitle(pathname: string): string {
  const match = portalRoutes.find((item) =>
    item.path === '/'
      ? pathname === '/'
      : pathname === item.path || pathname.startsWith(`${item.path}/`),
  );
  return match?.label ?? 'Portal';
}
