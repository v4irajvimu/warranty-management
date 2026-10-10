import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import type { AppIcon } from '@warranty-management/office-portal-util';

export const navIcons: Record<string, AppIcon> = {
  '/': DashboardOutlinedIcon,
  '/users': PeopleOutlinedIcon,
  '/reports': AssessmentOutlinedIcon,
  '/settings': SettingsOutlinedIcon,
};
