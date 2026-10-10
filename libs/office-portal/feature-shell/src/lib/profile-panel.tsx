import LogoutIcon from '@mui/icons-material/Logout';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  Stack,
  Typography,
} from '@mui/material';
import { useAuth } from '@warranty-management/office-portal-data-access';
import { layoutColors } from '@warranty-management/office-portal-ui';

export const PROFILE_PANEL_WIDTH = 280;

function ProfileContent() {
  const { profile, logout } = useAuth();

  if (!profile) return null;

  const initials = profile.displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: layoutColors.sidebar,
        p: 3,
      }}
    >
      <Typography variant="overline" color="text.secondary" sx={{ mb: 2 }}>
        Profile
      </Typography>
      <Stack spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'primary.main',
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          {initials || 'U'}
        </Avatar>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6">{profile.displayName}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {profile.email}
          </Typography>
        </Box>
        <Chip
          label={profile.role === 'admin' ? 'Admin' : 'User'}
          color={profile.role === 'admin' ? 'primary' : 'default'}
          size="small"
          sx={{ fontWeight: 600, textTransform: 'capitalize' }}
        />
      </Stack>
      <Divider sx={{ borderColor: 'rgba(148,163,184,0.12)', mb: 2 }} />
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'rgba(15, 23, 42, 0.45)',
          border: '1px solid rgba(148,163,184,0.12)',
          mb: 'auto',
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block' }}
        >
          Workspace access
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {profile.role === 'admin'
            ? 'Full admin portal access including user management.'
            : 'Standard portal access to dashboard, reports, and settings.'}
        </Typography>
      </Box>
      <Button
        fullWidth
        variant="outlined"
        color="inherit"
        startIcon={<LogoutIcon />}
        onClick={() => void logout()}
        sx={{ mt: 3, borderColor: 'rgba(148,163,184,0.28)' }}
      >
        Sign out
      </Button>
    </Box>
  );
}

interface ProfilePanelProps {
  open: boolean;
  onClose: () => void;
}

export function ProfilePanel({ open, onClose }: ProfilePanelProps) {
  return (
    <Drawer
      anchor="right"
      variant="temporary"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: PROFILE_PANEL_WIDTH,
          border: 'none',
        },
      }}
    >
      <ProfileContent />
    </Drawer>
  );
}
