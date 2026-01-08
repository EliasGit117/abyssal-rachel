import { ComponentProps } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar.tsx';
import { Link } from '@tanstack/react-router';
import { envConfig } from '@/lib/env-config.ts';
import Logo from '@/assets/icons/logo.svg?react';
import { NavUser } from './nav-user.tsx';
import { NavLinkGroup } from './nav-link-group.tsx';
import { mainLinks } from './links.ts';
import { NavSettings } from './nav-settings.tsx';
import { useSession } from '@/hooks/use-session.ts';
import { IconBuildingStore } from '@tabler/icons-react';


interface IAdminSidebarProps extends ComponentProps<typeof Sidebar> {
}

export function AdminSidebar({ ...props }: IAdminSidebarProps) {
  const { user } = useSession();
  const { setOpenMobile } = useSidebar();

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
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip='Shop' asChild>
                    <Link onClick={() => setOpenMobile(false)} to='/'>
                      <IconBuildingStore/>
                      <span>Store</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <NavLinkGroup label="Main" items={mainLinks({ role: user?.role })}/>
        <div className="flex-1"/>
        <NavSettings/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  );
}
