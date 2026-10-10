import { Alert, Box, Button } from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@warranty-management/office-portal-data-access';
import { LoadingScreen } from '@warranty-management/office-portal-ui';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, configured, logout } = useAuth();
  const location = useLocation();

  if (!configured) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <LoadingScreen message="Checking your session…" />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!profile) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          bgcolor: 'background.default',
        }}
      >
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void logout()}>
              Sign out
            </Button>
          }
        >
          Your account is signed in, but no Firestore profile was found for this
          user. Create a <strong>users/{'{uid}'}</strong> document or register a
          new account.
        </Alert>
      </Box>
    );
  }

  return children;
}
