import { LinkOptions } from '@tanstack/react-router';
import {
  type Icon,
  IconCategory,
  IconDashboard,
  IconNetwork,
  IconSettings,
  IconUsers
} from '@tabler/icons-react';
import { hasRolePermission } from '@/features/auth/lib/has-role-permission.ts';
import { Permission } from '@/features/auth/lib/permissions.ts';

export interface INavItem {
  title: string;
  icon: Icon;
  linkOptions: LinkOptions;
}

interface ILiknOptions {
  role?: string | null;
}

interface NavConfig extends INavItem {
  can?: (role?: string | null) => boolean;
}

const mainLinks: NavConfig[] = [
  {
    title: 'Dashboard',
    icon: IconDashboard,
    linkOptions: { to: '/admin', activeOptions: { exact: true } }
  },
  {
    title: 'Categories',
    icon: IconCategory,
    linkOptions: { to: '/admin/categories' },
    can: (role) =>
      hasRolePermission({ role, permissions: { categories: [Permission.List] } })
  },
  {
    title: 'Settings',
    icon: IconSettings,
    linkOptions: { to: '/admin/settings' }
  }
];

const userLinks: NavConfig[] = [
  {
    title: 'Users',
    icon: IconUsers,
    linkOptions: { to: '/admin/users' },
    can: (role) =>
      hasRolePermission({ role, permissions: { user: [Permission.List] } })
  },
  {
    title: 'Sessions',
    icon: IconNetwork,
    linkOptions: { to: '/admin/sessions' },
    can: (role) =>
      hasRolePermission({ role, permissions: { session: [Permission.List] } })
  },
];

export const getMainLinks = ({ role }: ILiknOptions = {}): INavItem[] => mainLinks
  .filter(({ can }) => !can || can(role));

export const getUserLinks = ({ role }: ILiknOptions = {}): INavItem[] => userLinks
  .filter(({ can }) => !can || can(role));
