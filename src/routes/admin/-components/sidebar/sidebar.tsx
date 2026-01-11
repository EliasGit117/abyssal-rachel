import { ComponentProps } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar.tsx';
import { Link } from '@tanstack/react-router';
import { envConfig } from '@/lib/env-config.ts';
import Logo from '@/assets/icons/logo.svg?react';
import { NavUser } from './nav-user.tsx';
import { NavLinkGroup } from './nav-link-group.tsx';
import { getMainLinks, getUserLinks } from './links.ts';
import { NavSettings } from './nav-settings.tsx';
import { useSession } from '@/hooks/use-session.ts';



interface IAdminSidebarProps extends ComponentProps<typeof Sidebar> {}

export function AdminSidebar({ ...props }: IAdminSidebarProps) {
  const { user } = useSession();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!" asChild>
              <Link to="/">
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

        <NavLinkGroup label="Main" items={getMainLinks({ role: user?.role })}/>
        <NavLinkGroup label="Auth" items={getUserLinks({ role: user?.role })}/>

        <NavSettings className='mt-auto'/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  );
}
