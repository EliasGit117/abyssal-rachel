import { LinkOptions } from '@tanstack/react-router';
import {
  type Icon,
  IconCategory,
  IconDashboard,
  IconNetwork,
  IconSettings,
  IconUsers
} from '@tabler/icons-react';
import { hasPermissionsForRole } from '@/lib/auth/has-permission-for-role.ts';
import { Permission } from '@/lib/auth/permissions.ts';

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
    title: "Dashboard",
    icon: IconDashboard,
    linkOptions: { to: "/admin", activeOptions: { exact: true } },
  },
  {
    title: "Settings",
    icon: IconSettings,
    linkOptions: { to: "/admin/settings" },
  },
];

const catalogLinks: NavConfig[] = [
  {
    title: "Categories",
    icon: IconCategory,
    linkOptions: { to: "/admin/categories" },
    can: (role) => hasPermissionsForRole(role, { canListCategory: { category: [Permission.List] } }).canListCategory,
  },
];

const userLinks: NavConfig[] = [
  {
    title: "Users",
    icon: IconUsers,
    linkOptions: { to: "/admin/users" },
    can: (role) => hasPermissionsForRole(role, { canListUsers: { user: [Permission.List] } }).canListUsers,
  },
  {
    title: "Sessions",
    icon: IconNetwork,
    linkOptions: { to: "/admin/sessions" },
    can: (role) => hasPermissionsForRole(role, { canListSessions: { session: [Permission.List] } }).canListSessions,
  },
];

export const getMainLinks = ({ role }: ILiknOptions = {}): INavItem[] => mainLinks
  .filter(({ can }) => !can || can(role));

export const getUserLinks = ({ role }: ILiknOptions = {}): INavItem[] => userLinks
  .filter(({ can }) => !can || can(role));

export const getCatalogLinks = ({ role }: ILiknOptions = {}): INavItem[] => catalogLinks
  .filter(({ can }) => !can || can(role));