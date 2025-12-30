import { ComponentProps, FC, useState, useEffect } from 'react';
import { Link, useMatches, useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeDropdown } from '@/components/theme';
import { useBodyScrollPosition } from '@n8tb1t/use-scroll-position';
import { LocaleDropdown } from '@/components/locale';
import HeaderNavMenu from '@/routes/_public/-components/app-nav-menu.tsx';
import { AppSidebarTrigger } from '@/routes/_public/-components/app-sidebar.tsx';
import Logo from '@/assets/icons/logo.svg?react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { IconKey, IconLogin2, IconUserCircle, IconUserPlus } from '@tabler/icons-react';
import { SignedOut } from '@/components/auth/signed-out.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { SignedIn } from '@/components/auth/signed-in.tsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client.ts';
import { useSession } from '@/hooks/use-session.ts';
import { Spinner } from '@/components/ui/spinner.tsx';
import { toast } from 'sonner';
import { m } from '@/paraglide/messages';


interface IAppHeader extends ComponentProps<'header'> {
}

export const AppHeader: FC<IAppHeader> = ({ className, ...props }) => {
  const matches = useMatches();
  const headerOptions = matches.find((match) => match.staticData.headerOptions)?.staticData.headerOptions;
  const { type } = headerOptions ?? { type: 'sticky' };

  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useBodyScrollPosition(({ top }) => {
    if (!mounted) return;
    setIsAtTop(top);
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setIsAtTop(window?.scrollY === 0);

    const timer = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(timer);
  }, [mounted]);

  return (
    <header
      className={cn(
        !mounted && 'sr-only',
        'sticky top-0 flex h-16 shrink-0 items-center gap-2 z-50',
        'bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/90',
        'dark:supports-backdrop-filter:bg-background/75 border-b',
        'transition-opacity duration-100 ease-out',
        type === 'fixed' && 'fixed left-0 right-0',
        entered ? 'opacity-150 translate-y-0' : 'opacity-0 -translate-y-4',
        isAtTop && 'bg-transparent! border-b-transparent backdrop-blur-none',
        isAtTop && type === 'fixed' && 'text-white',
        className
      )}
      {...props}
    >
      <div className="container mx-auto px-4 flex gap-2 items-center">
        <AppSidebarTrigger size="icon-sm" className="lg:hidden -ml-2"/>

        <Button variant="link" size="dense" asChild>
          <Link to="/">
            <Logo
              className={cn(
                'h-4 lg:h-5! w-fit!',
                isAtTop && type === 'fixed' ? 'text-white' : 'text-foreground'
              )}/>
          </Link>
        </Button>

        <HeaderNavMenu
          transparent={isAtTop}
          className="hidden lg:flex gap-2 xl:gap-8 items-center absolute left-1/2 -translate-x-1/2"
        />

        <div className="flex gap-1 items-center ml-auto -mr-1.5">
          <LocaleDropdown variant="ghost" align="end"/>
          <ThemeDropdown variant="ghost" size="icon" align="end"/>

          <SignedOut>
            <AuthDropdown variant="ghost" size="icon" align="end"/>
          </SignedOut>
          <SignedIn>
            <UserDropdown size="icon" align="end"/>
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

interface IAuthDropdown extends ComponentProps<typeof Button> {
  align?: 'center' | 'start' | 'end';
}

const AuthDropdown: FC<IAuthDropdown> = ({ align, ...props }) => {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon-sm" variant="outline" {...props}>
          <IconUserCircle/>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-42" align={align}>
        <DropdownMenuLabel className="flex items-center gap-2">
          <IconKey className="size-4"/>
          <span>{m['components.auth_dropdown.title']()}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator/>

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/auth/sign-in">
              <IconLogin2/>
              <span>{m['components.auth_dropdown.sign_in']()}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/auth/sign-up">
              <IconUserPlus/>
              <span>{m['components.auth_dropdown.sign_up']()}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


interface IUserDropdown extends ComponentProps<typeof Button> {
  align?: 'center' | 'start' | 'end';
}

const UserDropdown: FC<IUserDropdown> = ({ align, className, ...props }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const session = useSession();
  const { mutate: signOut, isPending } = useMutation({
    mutationFn: () => authClient.signOut(),
    onSuccess: (res) => {
      if (!res.error) {
        queryClient.setQueryData(['session'], null);
        router.invalidate();
        return;
      }

      throw new Error(res.error.message);
    },
    onError: (error) => {
      toast.error(m['common.error'](), { description: error.message });
    }
  });

  const initials = getInitials(session?.user.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className={cn('rounded-full', className)} variant="ghost"{...props}>
          <Avatar className="size-7">
            <AvatarImage src={session?.user.image ?? ''} alt="@shadcn"/>
            <AvatarFallback className="text-xs!">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-42" align={align}>
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span className="text-foreground text-sm">
            {session?.user.name}
          </span>
          <span>{session?.user.email}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator/>

        <DropdownMenuGroup>
          <DropdownMenuItem disabled={isPending} onClick={() => signOut()}>
            {!isPending ? (
              <>
                <IconLogin2/>
                <span>{m['components.user_dropdown.sign_out']()}</span>
              </>
            ) : (
              <>
                <Spinner/>
                <span>{m['components.user_dropdown.signing_out']()}</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function getInitials(fullName?: string): string | undefined {
  return fullName
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase()).join('');
}
