import {
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '@warranty-management/office-portal-data-access';
import { PageHeader } from '@warranty-management/office-portal-ui';

export function SettingsPage() {
  const { profile } = useAuth();

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Profile preferences (local dummy controls)."
      />
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
          maxWidth: 560,
        }}
      >
        <Stack spacing={2.5}>
          <TextField
            label="Display name"
            value={profile?.displayName ?? ''}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField
            label="Email"
            value={profile?.email ?? ''}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField
            label="Role"
            value={profile?.role ?? ''}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
            sx={{ textTransform: 'capitalize' }}
          />
          <FormControlLabel
            control={<Switch defaultChecked color="primary" />}
            label="Email me weekly summaries"
          />
          <Typography variant="caption" color="text.secondary">
            These toggles are UI-only placeholders for this demo portal.
          </Typography>
        </Stack>
      </Paper>
    </>
  );
}
