import { Alert, Box, Paper, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  illustration: string;
  illustrationAlt: string;
  configured: boolean;
  children: ReactNode;
}

export function AuthLayout({
  title,
  subtitle,
  illustration,
  illustrationAlt,
  configured,
  children,
}: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background:
          'radial-gradient(ellipse at 20% 20%, rgba(59,130,246,0.22), transparent 45%), radial-gradient(ellipse at 80% 0%, rgba(37,99,235,0.18), transparent 40%), linear-gradient(145deg, #07111f 0%, #0B1F3A 45%, #0E1726 100%)',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          p: 6,
        }}
      >
        <Box sx={{ maxWidth: 480, textAlign: 'center' }}>
          <Box
            component="img"
            src={illustration}
            alt={illustrationAlt}
            sx={{ width: '100%', maxWidth: 420, mb: 4 }}
          />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Admin Portal
          </Typography>
          <Typography color="text.secondary">
            Secure role-based access for your team workspace.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 440,
            p: { xs: 3, sm: 4 },
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'rgba(21, 34, 56, 0.92)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Typography variant="h5" sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {subtitle}
          </Typography>

          {!configured ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Firebase is not configured. Copy <strong>.env.example</strong> to{' '}
              <strong>.env</strong>, add your Firebase web app keys, then
              restart the dev server.
            </Alert>
          ) : null}

          {children}
        </Paper>
      </Box>
    </Box>
  );
}
