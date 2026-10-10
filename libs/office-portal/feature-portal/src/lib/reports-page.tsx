import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { PageHeader } from '@warranty-management/office-portal-ui';

const reports = [
  { title: 'Weekly activity summary', updated: 'Updated 2 hours ago' },
  { title: 'Access audit log', updated: 'Updated yesterday' },
  { title: 'Feature adoption metrics', updated: 'Updated 3 days ago' },
];

export function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Dummy report list available to all signed-in roles."
      />
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <List>
          {reports.map((report) => (
            <ListItem key={report.title} divider>
              <ListItemText
                primary={report.title}
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {report.updated}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </>
  );
}
