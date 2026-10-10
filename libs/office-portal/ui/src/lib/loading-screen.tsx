import { Box, CircularProgress, Typography } from '@mui/material';

export function LoadingScreen({ message = 'Loading…' }: { message?: string }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        bgcolor: 'background.default',
      }}
    >
      <CircularProgress color="primary" />
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
}
