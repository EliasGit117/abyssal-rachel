import {
  SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, useSidebar
} from '@/components/ui/sidebar';
import { Link } from '@tanstack/react-router';
import { INavItem } from '@/routes/admin/-components/sidebar/links.ts';



interface INavLinkGroup {
  label?: string;
  items: INavItem[];
}

export function NavLinkGroup({ items, label }: INavLinkGroup) {
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
}
