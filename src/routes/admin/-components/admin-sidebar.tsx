import { ComponentProps, FC } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, useSidebar
} from '@/components/ui/sidebar';
import { Link } from '@tanstack/react-router';
import {
  IconBoxMultiple,
  IconDashboard,
  IconNews,
  IconSettings,
  IconShoppingBag,
  IconTag
} from '@tabler/icons-react';
import { envConfig } from '@/lib/env-config.ts';
import { INavItem } from '@/routes/admin/types/admin-base-link.ts';
import Logo from '@/assets/icons/logo.svg?react';



interface IAdminSidebarProps extends ComponentProps<typeof Sidebar> {}

export function AdminSidebar({ ...props }: IAdminSidebarProps) {

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!" asChild>
              <Link to="/admin">
                <Logo className='h-4! w-full! max-w-20!'/>
                <span className="sr-only">
                  {envConfig.appName}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavLinkGroup label="Main" items={navMain}/>
        <div className="flex-1"/>
        {/*<NavSettings/>*/}
      </SidebarContent>
      <SidebarFooter>
        {/*<NavUser/>*/}
      </SidebarFooter>
    </Sidebar>
  );
}


interface INavLinkGroupProps {
  label?: string;
  items: INavItem[];
}

const NavLinkGroup: FC<INavLinkGroupProps> = ({ items, label }) => {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link
                  onClick={() => setOpenMobile(false)}
                  activeProps={{ className: 'bg-sidebar-accent font-medium text-sidebar-accent-foreground' }}
                  {...item.linkOptions}
                >
                  {item.icon && <item.icon/>}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};


const navMain: INavItem[] = [
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