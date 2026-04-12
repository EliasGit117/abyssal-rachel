import { hasPermissionsForRole } from '@/lib/auth/has-permission-for-role.ts';
import { Permission } from '@/lib/auth/permissions.ts';
import type { LinkOptions } from '@tanstack/router-core';
import {
  Icon, IconAdjustments,
  IconCategory,
  IconListSearch, IconLock,
  IconNetwork,
  IconSettings,
  IconShoppingCart,
  IconUsers
} from '@tabler/icons-react';

interface INavItem {
  title: string;
  linkOptions?: LinkOptions;
  icon?: Icon;
}

interface ISidebarMenuItem {
  title: string;
  linkOptions?: LinkOptions;
  icon?: Icon;
  items?: INavItem[];
}

type TRole = string | undefined | null;

export function getLinkGroups(role: TRole) {
  const permissions = hasPermissionsForRole(role, {
    canListCategories: { category: [Permission.List] },
    canListUsers: { user: [Permission.List] },
    canListSessions: { session: [Permission.List] }
  });

  const productsMenu: ISidebarMenuItem = { title: 'Products', icon: IconShoppingCart, items: [] };
  const usersMenu: ISidebarMenuItem = { title: 'Users', icon: IconUsers, items: [] };
  const settingsMenu: ISidebarMenuItem = {
    title: 'Settings',
    icon: IconSettings,
    items: [
      {
        title: 'Preferences',
        icon: IconAdjustments,
        linkOptions: { to: '/admin/settings/preferences', activeOptions: { exact: true } }
      },
      {
        title: 'Security',
        icon: IconLock,
        linkOptions: { to: '/admin/settings/security', activeOptions: { exact: true } }
      }
    ]
  };


  if (permissions.canListCategories)
    productsMenu.items?.push({ title: 'Categories', icon: IconCategory, linkOptions: { to: '/admin/categories' } });

  if (permissions.canListUsers)
    usersMenu.items?.push({ title: 'User list', icon: IconListSearch, linkOptions: { to: '/admin/users' } });

  if (permissions.canListSessions)
    usersMenu.items?.push({
      title: 'User sessions',
      icon: IconNetwork,
      linkOptions: { to: '/admin/sessions', activeOptions: { exact: false } }
    });


  return ({
    main: [
      productsMenu,
      usersMenu,
      settingsMenu
    ],
  } satisfies Record<string, ISidebarMenuItem[]>);
}
