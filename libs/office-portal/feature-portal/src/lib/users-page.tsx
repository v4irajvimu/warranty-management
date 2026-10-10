import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { PageHeader } from '@warranty-management/office-portal-ui';

const dummyUsers = [
  {
    name: 'Alex Morgan',
    email: 'alex@example.com',
    role: 'admin',
    status: 'Active',
  },
  {
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    role: 'user',
    status: 'Active',
  },
  {
    name: 'Sam Rivera',
    email: 'sam@example.com',
    role: 'user',
    status: 'Invited',
  },
  {
    name: 'Casey Kim',
    email: 'casey@example.com',
    role: 'user',
    status: 'Active',
  },
];

export function UsersPage() {
  return (
    <>
      <PageHeader
        title="Users"
        subtitle="Admin-only view of portal members (dummy data)."
      />
      <Paper
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyUsers.map((user) => (
              <TableRow key={user.email} hover>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell sx={{ textTransform: 'capitalize' }}>
                  {user.role}
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={user.status}
                    color={user.status === 'Active' ? 'primary' : 'default'}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}
