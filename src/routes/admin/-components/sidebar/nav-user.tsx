import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { useSession } from '@/hooks/use-session.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client.ts';
import { Spinner } from '@/components/ui/spinner.tsx';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar.tsx';
import { ComponentProps, FC } from 'react';
import { IconDotsVertical, IconLogout, IconUserCircle } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';


export const NavUser: FC<ComponentProps<typeof SidebarMenu>> = ({ ...props }) => {
  const queryClient = useQueryClient();
  const { isMobile } = useSidebar();
  const { user } = useSession();

  const initials = getInitials(user?.name);

  const { isPending, mutate: signOut } = useMutation({
    mutationFn: () => authClient.signOut(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['session'] })
    }
  });

  return (
    <SidebarMenu {...props}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg after:border-none border">
                <AvatarImage src={user?.image ?? ''} alt={initials}/>
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user?.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4"/>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg after:border-none border">
                  <AvatarImage src={user?.image ?? ''} alt={initials}/>
                  <AvatarFallback className="rounded-lg uppercase">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to=".">
                  <IconUserCircle/>
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator/>
            <DropdownMenuItem onClick={() => signOut()} disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner/>
                  <span>Signing out</span>
                </>
              ) : (
                <>
                  <IconLogout/>
                  <span>Sign out</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

function getInitials(fullName?: string): string | undefined {
  return fullName
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase()).join('');
}
