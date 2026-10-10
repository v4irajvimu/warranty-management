import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@warranty-management/office-portal-data-access';
import { getPageTitle } from '@warranty-management/office-portal-util';
import { ProfilePanel } from './profile-panel';
import { Sidebar, SIDEBAR_WIDTH } from './sidebar';

function getInitials(displayName?: string): string {
  if (!displayName?.trim()) return 'U';
  return displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function AppShell() {
  const { profile } = useAuth();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pageTitle = getPageTitle(location.pathname);

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Sidebar mobileOpen={navOpen} onClose={() => setNavOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: '100%',
            md: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          },
          minWidth: 0,
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'rgba(14, 23, 38, 0.92)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setNavOpen(true)}
              sx={{ mr: 1, display: { md: 'none' } }}
              aria-label="Open navigation"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              {pageTitle}
            </Typography>
            <IconButton
              onClick={() => setProfileOpen(true)}
              aria-label="Open profile"
              sx={{ p: 0.5 }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'primary.main',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {getInitials(profile?.displayName)}
              </Avatar>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>

      <ProfilePanel open={profileOpen} onClose={() => setProfileOpen(false)} />
    </Box>
  );
}
