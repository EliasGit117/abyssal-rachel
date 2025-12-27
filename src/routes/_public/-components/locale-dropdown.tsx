import { ComponentProps, FC, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button, buttonVariants } from '@/components/ui/button';
import type { VariantProps } from 'class-variance-authority';
import { IconLanguage, IconSelector } from '@tabler/icons-react';


interface IProps extends ComponentProps<typeof DropdownMenuTrigger> {
  variant?: VariantProps<typeof buttonVariants>['variant'];
  align?: 'start' | 'center' | 'end';
}

const locales = [{ value: 'ro', title: 'Romana' }, { value: 'ru', title: 'Русский' }] as const;
type TLocaleValue = typeof locales[number]['value'];

const LanguageDropdown: FC<IProps> = ({ variant, align, ...props }) => {
  const [lang, setLang] = useState<TLocaleValue>('ro');

  const handleChange = (value: string) => {
    if (!locales.some(l => l.value === value))
      return;

    setLang(value as TLocaleValue);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size='sm' {...props}>
          <span className='uppercase sm:hidden'>{lang}</span>

          <IconLanguage className='hidden sm:block opacity-65'/>
          <span className='hidden sm:block'>
            {locales.find(item => item.value === lang)?.title}
          </span>
          <IconSelector className='hidden sm:block opacity-65'/>

          <span className="sr-only">Language dropdown</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-36" align={align}>
        <DropdownMenuLabel className="flex items-center gap-2">
          <IconLanguage className="size-4"/>
          <span>Language</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator/>

        <DropdownMenuRadioGroup value={lang} onValueChange={handleChange}>
          {locales.map(({ value, title }) =>
            <DropdownMenuRadioItem
              key={value}
              value={value}
              className="justify-between gap-4"
              onClick={() => setLang(value)}
            >
              <span>{title}</span>
              <span className="text-xs uppercase text-muted-foreground">
                {value}
              </span>
            </DropdownMenuRadioItem>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;