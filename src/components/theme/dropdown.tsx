import { type ComponentProps, type FC } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { TTheme, useTheme } from './provider';
import { Icon, IconDeviceImac, IconMoon, IconSun, IconSunMoon } from '@tabler/icons-react';
import { m } from '@/paraglide/messages';


interface IThemeDropdownProps extends ComponentProps<typeof Button> {
  align?: 'start' | 'center' | 'end';
}

const themeOptions: { label: string; value: TTheme; icon: Icon; }[] = [
  { label: m['components.theme_dropdown.light'](), value: 'light', icon: IconSun },
  { label: m['components.theme_dropdown.dark'](), value: 'dark', icon: IconMoon },
  { label: m['components.theme_dropdown.system'](), value: 'system', icon: IconDeviceImac }
];

export const ThemeDropdown: FC<IThemeDropdownProps> = ({ align, ...props }) => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" {...props}>
          <IconSun className="dark:hidden"/>
          <IconMoon className="hidden dark:block"/>
          <span className="sr-only">
            {m['components.theme_dropdown.title']()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='min-w-36' align={align}>
        <DropdownMenuRadioGroup value={theme}>
          <DropdownMenuLabel className="flex gap-2 items-center">
            <IconSunMoon className="size-4"/>
            <span>
              {m['components.theme_dropdown.title']()}
            </span>
          </DropdownMenuLabel>

          <DropdownMenuSeparator/>

          {themeOptions.map(({ icon: Icon, label, value }) =>
            <DropdownMenuRadioItem value={value} onClick={() => setTheme(value)} key={value}>
              <Icon className="text-muted-foreground"/>
              <span>{label}</span>
            </DropdownMenuRadioItem>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>

    </DropdownMenu>
  );
};
