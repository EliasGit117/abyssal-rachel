import { LinkOptions } from '@tanstack/react-router';
import type { Icon } from '@tabler/icons-react';
import {
  IconBoxMultiple,
  IconDashboard,
  IconNews,
  IconSettings,
  IconShoppingBag,
  IconTag,
} from '@tabler/icons-react';



export interface INavItem {
  title: string;
  icon: Icon;
  linkOptions: LinkOptions;
}

export const mainLinks: INavItem[] = [
  {
    title: 'Dashboard',
    linkOptions: { to: '/admin', activeOptions: { exact: true } },
    icon: IconDashboard
  },
  {
    title: 'Banners',
    linkOptions: { to: '/' },
    icon: IconBoxMultiple
  },
  {
    title: 'News',
    linkOptions: { to: '/' },
    icon: IconNews
  },
  {
    title: 'Categories',
    linkOptions: { to: '/' },
    icon: IconTag
  },
  {
    title: 'Products',
    linkOptions: { to: '/' },
    icon: IconShoppingBag
  },
  {
    title: 'Settings',
    linkOptions: { to: '/' },
    icon: IconSettings
  }
];