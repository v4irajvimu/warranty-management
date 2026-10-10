import { Alert, Box, Button, Link as MuiLink, TextField } from '@mui/material';
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@warranty-management/office-portal-data-access';
import {
  AuthLayout,
  LoadingScreen,
} from '@warranty-management/office-portal-ui';
import loginIllustration from './login.svg';

export function LoginPage() {
  const { login, user, profile, loading, configured } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading || (user && !profile && !error)) {
    return <LoadingScreen message="Loading your profile…" />;
  }

  if (user && profile) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to sign in. Try again.';
      setError(
        message
          .replace('Firebase: ', '')
          .replace(/\(auth\/.*\)\.?/, '')
          .trim() || 'Unable to sign in.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in with your email and password."
      illustration={loginIllustration}
      illustrationAlt="Secure login illustration"
      configured={configured}
    >
      <Box component="form" onSubmit={(e) => void handleSubmit(e)} noValidate>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          margin="normal"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!configured || submitting}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          margin="normal"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={!configured || submitting}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={!configured || submitting}
          sx={{ mt: 2.5, mb: 2 }}
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <MuiLink component={Link} to="/register" underline="hover">
            Need an account? Register
          </MuiLink>
        </Box>
      </Box>
    </AuthLayout>
  );
}
