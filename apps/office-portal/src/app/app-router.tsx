import { Navigate, Route, Routes } from 'react-router-dom';
import {
  LoginPage,
  RegisterPage,
} from '@warranty-management/office-portal-feature-auth';
import {
  DashboardPage,
  ReportsPage,
  SettingsPage,
  UsersPage,
} from '@warranty-management/office-portal-feature-portal';
import {
  AppShell,
  ProtectedRoute,
  RoleRoute,
} from '@warranty-management/office-portal-feature-shell';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route
          path="users"
          element={
            <RoleRoute roles={['admin']}>
              <UsersPage />
            </RoleRoute>
          }
        />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
