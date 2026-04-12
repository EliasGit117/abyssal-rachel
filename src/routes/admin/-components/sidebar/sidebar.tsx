import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
  sidebarMenuButtonVariants, SidebarGroupContent
} from '@/components/ui/sidebar';
import type { ComponentPropsWithoutRef, FC } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.tsx';
import type { VariantProps } from 'class-variance-authority';
import type { LinkOptions } from '@tanstack/router-core';
import { Link, useLocation } from '@tanstack/react-router';
import { cn, envConfig } from '@/lib/utils';
import {
  Icon,
  IconChevronRight,
  IconDeviceImac,
  IconLanguage,
  IconMoon,
  IconSun,
  IconSunMoon,
} from '@tabler/icons-react';
import Logo from '@/assets/icons/logo.svg?react';
import { getLocale, Locale, setLocale } from '@/paraglide/runtime';
import { useTheme } from '@/components/theme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { NavUser } from './nav-user';
import { getLinkGroups } from '@/routes/admin/-components/sidebar/links.ts';
import { useSession } from '@/hooks/use-session.ts';


interface INavItem {
  title: string;
  linkOptions?: LinkOptions;
  icon?: Icon;
}

interface ISidebarMenuItem {
  title: string;
  linkOptions?: LinkOptions;
  icon?: Icon;
  items?: INavItem[];
}


export const AdminSidebar: FC<ComponentPropsWithoutRef<typeof Sidebar>> = ({ ...props }) => {
  const { setOpenMobile } = useSidebar();
  const { user } = useSession();
  const linkGroups = getLinkGroups(user?.role);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/" onClick={() => setOpenMobile(false)}>
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
        <NavSidebarGroup items={linkGroups.main} label="Main"/>
      </SidebarContent>

      <SidebarFooter>
        <NavSettings/>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  );
};

interface INavSidebarGroupProps extends ComponentPropsWithoutRef<typeof SidebarGroup> {
  label?: string;
  items: ISidebarMenuItem[];
  itemsSize?: VariantProps<typeof sidebarMenuButtonVariants>['size'];
}

const sidebarMenuSubButtonSizes: Record<NonNullable<VariantProps<typeof sidebarMenuButtonVariants>['size']>, ComponentPropsWithoutRef<typeof SidebarMenuSubButton>['size']> = {
  default: 'md',
  sm: 'sm',
  lg: 'md'
};

const NavSidebarGroup: FC<INavSidebarGroupProps> = ({ label, items, itemsSize, ...props }) => {
  const { setOpenMobile } = useSidebar();
  const { pathname } = useLocation({ select: (state) => ({ pathname: state.pathname }) });

  return (
    <SidebarGroup {...props}>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}

      <SidebarMenu>
        {items.map((item) => {
          const hasActiveChild = item.items?.some((sub) => sub.linkOptions?.to === pathname) ?? false;

          return (
            <Collapsible key={item.title} defaultOpen={hasActiveChild} className="group/collapsible" asChild>
              <SidebarMenuItem>
                {!!item.linkOptions ? (
                  <>
                    <SidebarMenuButton
                      tooltip={item.title}
                      size={itemsSize}
                      onClick={() => setOpenMobile(false)}
                      asChild
                    >
                      <Link
                        {...item.linkOptions}
                        activeProps={{ 'data-active': true }}
                      >
                        {item.icon && <item.icon/>}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>

                    {(!!item.items && item.items.length > 0) && (
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="group">
                          <IconChevronRight className="group-data-[state=open]:rotate-90 transition-transform"/>
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                    )}
                  </>
                ) : (
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon/>}
                      <span>{item.title}</span>
                      {(!!item.items && item.items.length > 0) && (
                        <IconChevronRight
                          className="ml-auto group-data-[state=open]/collapsible:rotate-90 transition-transform"
                        />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                )}
                {(!!item.items && item.items?.length > 0) && (
                  <>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton size={sidebarMenuSubButtonSizes[itemsSize ?? 'default']} asChild>
                              <Link
                                {...subItem.linkOptions}
                                activeProps={{ 'data-active': true }}
                                onClick={() => setOpenMobile(false)}
                              >
                                {subItem.icon && <subItem.icon className="text-muted-foreground! size-3.5!"/>}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};


const localeOptions: { value: Locale; title: string; }[] = [
  { title: 'Romana', value: 'ro' },
  { title: 'Русский', value: 'ru' }
];

interface IProps {
  itemsSize?: VariantProps<typeof sidebarMenuButtonVariants>['size'];
}


export function NavSettings({ itemsSize, ...props }: IProps & ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const locale = getLocale();
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>
        Quick settings
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size={itemsSize}>
                  <span>Theme</span>
                  <IconSun className='ml-auto text-muted-foreground dark:hidden'/>
                  <IconMoon className='ml-auto text-muted-foreground hidden dark:block'/>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={cn("w-(--radix-dropdown-menu-trigger-width) rounded-lg", !isMobile && 'max-w-44')}
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuRadioGroup value={theme}>
                  <DropdownMenuLabel className="flex gap-2 items-center">
                    <IconSunMoon className="size-4"/>
                    <span>Theme</span>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator/>

                  <DropdownMenuRadioItem value="light" onClick={() => setTheme('light')}>
                    <IconSun className="text-muted-foreground"/>
                    <span>Light</span>
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="dark" onClick={() => setTheme('dark')}>
                    <IconMoon className="text-muted-foreground"/>
                    <span>Dark</span>
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="system" onClick={() => setTheme('system')}>
                    <IconDeviceImac className="text-muted-foreground"/>
                    <span>System</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <span>Language</span>
                  <span className="ml-auto text-muted-foreground uppercase text-xs">
                    {locale}
                  </span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className={cn("w-(--radix-dropdown-menu-trigger-width) rounded-lg", !isMobile && 'max-w-44')}
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuRadioGroup value={locale}>
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <IconLanguage className="size-4"/>
                    <span>Language</span>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator/>

                  {localeOptions.map(({ value, title }) =>
                    <DropdownMenuRadioItem key={value} value={value} className="gap-4" onClick={() => setLocale(value)}>
                      <span className="text-xs uppercase text-muted-foreground">
                        {value}
                      </span>
                      <span>{title}</span>
                    </DropdownMenuRadioItem>
                  )}

                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
