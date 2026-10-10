import { Navigate } from 'react-router-dom';
import { useAuth } from '@warranty-management/office-portal-data-access';
import type { Role } from '@warranty-management/office-portal-util';

interface RoleRouteProps {
  roles: Role[];
  children: React.ReactNode;
}

export function RoleRoute({ roles, children }: RoleRouteProps) {
  const { profile } = useAuth();

  if (!profile || !roles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
