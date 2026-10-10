import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import { Box, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@warranty-management/office-portal-data-access';
import { PageHeader, StatCard } from '@warranty-management/office-portal-ui';
import { getDashboardActionsForRole } from '@warranty-management/office-portal-util';

export function DashboardPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const actions = profile ? getDashboardActionsForRole(profile.role) : [];

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${profile?.displayName ?? 'user'}. Here’s a snapshot of your workspace.`}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 2.5,
          mb: 4,
        }}
      >
        <StatCard
          title="Active users"
          value="128"
          subtitle="+12 this week"
          icon={PeopleOutlinedIcon}
        />
        <StatCard
          title="Open reports"
          value="24"
          subtitle="6 due today"
          icon={AssessmentOutlinedIcon}
        />
        <StatCard
          title="Tasks"
          value="41"
          subtitle="18 completed"
          icon={AssignmentOutlinedIcon}
        />
      </Box>

      <PageHeader
        title="Quick actions"
        subtitle="Jump to common portal areas."
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {actions.map((action) => (
          <Button
            key={action.path}
            variant="contained"
            size="large"
            onClick={() => navigate(action.path)}
            sx={{ minWidth: 160 }}
          >
            {action.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}
