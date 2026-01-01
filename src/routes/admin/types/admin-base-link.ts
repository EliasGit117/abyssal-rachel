import { LinkOptions } from '@tanstack/react-router';
import { Icon } from '@tabler/icons-react';


export interface INavItem {
  title: string;
  linkOptions?: LinkOptions;
  icon?: Icon;
}
