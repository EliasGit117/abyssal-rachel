import { LinkOptions } from '@tanstack/react-router';

export interface ILinkItem {
  label: string;
  description?: string;
  linkOpt: LinkOptions;
}

export enum MenuItemType {
  Single = 'single',
  Group = 'group',
}

export type TSingleLinkItem = { type: MenuItemType.Single; item: ILinkItem };
export type TLinkGroupItem = { type: MenuItemType.Group; title: string; items: ILinkItem[] };

export type TLinkItem = TSingleLinkItem | TLinkGroupItem;

export const baseLinks: TLinkItem[] = [
  {
    type: MenuItemType.Group,
    title: 'Products',
    items: [
      { label: 'Indoor LED Display', description: 'High-quality LED screens for indoor use.', linkOpt: { to: '/' } },
      {
        label: 'Outdoor LED Display',
        description: 'Durable and bright displays for outdoor environments.',
        linkOpt: { to: '/' }
      },
      {
        label: 'Rental LED Display',
        description: 'Portable LED solutions for events and shows.',
        linkOpt: { to: '/' }
      },
      {
        label: 'Transparent LED Screen',
        description: 'See-through LED displays for creative setups.',
        linkOpt: { to: '/' }
      },
      { label: 'Soft LED Screen', description: 'Flexible LED panels for unique installations.', linkOpt: { to: '/' } },
      {
        label: 'Floor Tile Screen',
        description: 'Interactive LED floor tiles for events and spaces.',
        linkOpt: { to: '/' }
      }
    ]
  },
  {
    type: MenuItemType.Group,
    title: 'News',
    items: [
      { label: 'All news', description: 'Discover latest news', linkOpt: { to: '/' } },
      { label: 'Company News', description: 'Updates and announcements from our company.', linkOpt: { to: '/' } },
      {
        label: 'LED Knowledge',
        description: 'Learn tips, insights, and LED display technology basics.',
        linkOpt: { to: '/' }
      }
    ]
  },
  {
    type: MenuItemType.Single,
    item: { label: 'Contact', linkOpt: { to: '/contact' } },

  },
  {
    type: MenuItemType.Single,
    item: { label: 'Notifications', linkOpt: { to: '/notifications' } }
  },
  {
    type: MenuItemType.Single,
    item: { label: 'Admin', linkOpt: { to: '/' } }
  }
];
