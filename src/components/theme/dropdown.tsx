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
import { type LucideIcon, MonitorIcon, MoonIcon, SunIcon, SunMoonIcon } from 'lucide-react';
import { TTheme, useTheme } from './provider';


interface IThemeDropdownProps extends ComponentProps<typeof Button> {
  align?: 'start' | 'center' | 'end';
}

const themeOptions: { label: string; value: TTheme; icon: LucideIcon; }[] = [
  { value: 'light', icon: SunIcon, label: 'Light' },
  { value: 'dark', icon: MoonIcon, label: 'Dark' },
  { value: 'system', icon: MonitorIcon, label: 'System' }
];

export const ThemeDropdown: FC<IThemeDropdownProps> = ({ align, ...props }) => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" {...props}>
          <SunIcon className="dark:hidden"/>
          <MoonIcon className="hidden dark:block"/>
          <span className="sr-only">
            Toggle theme dropdown
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='min-w-36' align={align}>
        <DropdownMenuRadioGroup value={theme}>
          <DropdownMenuLabel className="flex gap-2 items-center">
            <SunMoonIcon className="size-4"/>
            <span>Theme</span>
          </DropdownMenuLabel>

          <DropdownMenuSeparator/>

          {themeOptions.map(({ icon: Icon, label, value }) =>
            <DropdownMenuRadioItem value={value} onClick={() => setTheme(value)} key={value}>
              <span>{label}</span>
              <div className="min-w-1 flex-1"/>
              <Icon className="text-muted-foreground"/>
            </DropdownMenuRadioItem>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>

    </DropdownMenu>
  );
};
