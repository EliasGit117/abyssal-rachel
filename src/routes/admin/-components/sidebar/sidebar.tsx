import { ComponentProps } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar.tsx';
import { Link } from '@tanstack/react-router';
import { envConfig } from '@/lib/env-config.ts';
import Logo from '@/assets/icons/logo.svg?react';
import { NavUser } from './nav-user.tsx';
import { NavLinkGroup } from './nav-link-group.tsx';
import { mainLinks } from './links.ts';
import { NavSettings } from './nav-settings.tsx';


interface IAdminSidebarProps extends ComponentProps<typeof Sidebar> {
}

export function AdminSidebar({ ...props }: IAdminSidebarProps) {

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!" asChild>
              <Link to="/admin">
                <Logo className="h-4! w-full! max-w-20!"/>
                <span className="sr-only">
                  {envConfig.appName}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavLinkGroup label="Main" items={mainLinks}/>
        <div className="flex-1"/>
        <NavSettings/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  );
}
