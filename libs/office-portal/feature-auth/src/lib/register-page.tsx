import { Alert, Box, Button, Link as MuiLink, TextField } from '@mui/material';
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@warranty-management/office-portal-data-access';
import {
  AuthLayout,
  LoadingScreen,
} from '@warranty-management/office-portal-ui';
import registerIllustration from './register.svg';

export function RegisterPage() {
  const { register, user, profile, loading, configured } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading || (user && !profile && !error)) {
    return <LoadingScreen message="Setting up your account…" />;
  }

  if (user && profile) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await register(displayName.trim(), email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      const raw =
        err instanceof Error ? err.message : 'Unable to register. Try again.';
      const normalized = raw.toLowerCase();
      if (
        normalized.includes('permission') ||
        normalized.includes('insufficient')
      ) {
        setError(
          'Could not create your Firestore profile. Publish the rules from firestore.rules in the Firebase console, then try again.',
        );
      } else {
        setError(
          raw
            .replace('Firebase: ', '')
            .replace(/\(auth\/.*\)\.?/, '')
            .trim() || 'Unable to register.',
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Register to access the portal. New accounts start as regular users."
      illustration={registerIllustration}
      illustrationAlt="Account registration illustration"
      configured={configured}
    >
      <Box component="form" onSubmit={(e) => void handleSubmit(e)} noValidate>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        <TextField
          label="Full name"
          fullWidth
          required
          margin="normal"
          autoComplete="name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          disabled={!configured || submitting}
        />
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
          autoComplete="new-password"
          helperText="At least 6 characters"
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
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <MuiLink component={Link} to="/login" underline="hover">
            Already have an account? Sign in
          </MuiLink>
        </Box>
      </Box>
    </AuthLayout>
  );
}
