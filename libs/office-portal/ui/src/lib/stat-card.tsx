import { Box, Paper, Typography } from '@mui/material';
import type { AppIcon } from '@warranty-management/office-portal-util';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: AppIcon;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: StatCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 600 }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(59, 130, 246, 0.15)',
            color: 'primary.main',
          }}
        >
          <Icon fontSize="small" />
        </Box>
      </Box>
      <Typography variant="h4" component="p" sx={{ mb: 0.5 }}>
        {value}
      </Typography>
      {subtitle ? (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      ) : null}
    </Paper>
  );
}
