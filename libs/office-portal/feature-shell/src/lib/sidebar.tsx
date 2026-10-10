import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@warranty-management/office-portal-data-access';
import { layoutColors } from '@warranty-management/office-portal-ui';
import { getNavItemsForRole } from '@warranty-management/office-portal-util';
import { navIcons } from './navigation';

export const SIDEBAR_WIDTH = 260;

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { profile } = useAuth();
  const location = useLocation();
  const items = profile ? getNavItemsForRole(profile.role) : [];

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: layoutColors.sidebar,
      }}
    >
      <Toolbar sx={{ px: 2.5, minHeight: 72 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
            Admin Portal
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Role-based workspace
          </Typography>
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(148,163,184,0.12)' }} />
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {items.map((item) => {
          const selected =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
          const Icon = navIcons[item.path];
          return (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              onClick={onNavigate}
              selected={selected}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'rgba(59, 130, 246, 0.18)',
                  color: 'primary.light',
                  '& .MuiListItemIcon-root': { color: 'primary.light' },
                },
                '&:hover': {
                  bgcolor: 'rgba(59, 130, 246, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                {Icon ? <Icon fontSize="small" /> : null}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: { sx: { fontWeight: selected ? 600 : 500 } },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
          },
        }}
      >
        <SidebarContent onNavigate={onClose} />
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            borderRight: '1px solid rgba(148,163,184,0.12)',
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    </>
  );
}
