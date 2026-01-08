import { LinkOptions } from '@tanstack/react-router';
import {
  type Icon, IconCategory,
  IconDashboard,
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

interface IMainLinksOptions {
  role: string | undefined | null;
}

export const mainLinks: (options?: IMainLinksOptions) => INavItem[] = (options) => {
  const { role } = options ?? {};
  let result: INavItem[] = [
    { title: 'Dashboard', linkOptions: { to: '/admin', activeOptions: { exact: true } }, icon: IconDashboard }
  ];

  const canListUsers = hasRolePermission({ role: role, permissions: { user: [Permission.List] } });
  if (canListUsers)
    result.push({ title: 'Users', linkOptions: { to: '/admin/users' }, icon: IconUsers });

  const canListCategories = hasRolePermission({ role: role, permissions: { categories: [Permission.List] } });
  if (canListCategories)
    result.push({ title: 'Categories', linkOptions: { to: '/admin/categories' }, icon: IconCategory });

  result.push(
    { title: 'Settings', linkOptions: { to: '/admin/settings' }, icon: IconSettings }
  );

  return result;
};