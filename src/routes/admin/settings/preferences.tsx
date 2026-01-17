import { createFileRoute } from '@tanstack/react-router';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
  FieldTitle
} from '@/components/ui/field.tsx';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.tsx';
import {
  IconDeviceImac,
  IconLetterCase,
  IconMail,
  IconMailForward,
  IconMoon,
  IconSend,
  IconSun
} from '@tabler/icons-react';
import { isTheme, useTheme } from '@/components/theme';
import { getLocale, isLocale, setLocale } from '@/paraglide/runtime';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useSession } from '@/hooks/use-session.ts';


export const Route = createFileRoute('/admin/settings/preferences')({
  component: RouteComponent
});


function RouteComponent() {
  const { user } = useSession();
  const { theme, setTheme } = useTheme();
  const locale = getLocale();

  const onThemeChange = (v: string) => {
    if (!isTheme(v))
      return;

    setTheme(v);
  };

  const onLocaleChange = (v: string) => {
    if (!isLocale(v))
      return;

    setLocale(v);
  };

  return (
    <main className="container mx-auto space-y-4 py-4 px-1">
      <FieldSet>
        <FieldGroup>
          <FieldSet className="xl:flex-row">
            <FieldContent>
              <FieldLabel>Theme</FieldLabel>
              <FieldDescription>
                Choose how the application looks on your device.
              </FieldDescription>
            </FieldContent>

            <RadioGroup value={theme} onValueChange={onThemeChange} className="grid sm:grid-cols-3 gap-2 max-w-lg">
              {themeOptions.map((option) => (
                <FieldLabel key={option.value} htmlFor={`theme-${option.value}`}>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle className="flex items-center gap-2">
                        <option.icon className="size-4"/>
                        {option.label}
                      </FieldTitle>
                      <FieldDescription className="text-xs">
                        {option.description}
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value={option.value} id={`theme-${option.value}`}/>
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </FieldSet>

          <FieldSeparator/>

          <FieldSet className="md:flex-row">
            <FieldContent>
              <FieldLabel>Language</FieldLabel>
              <FieldDescription>
                Select the language you prefer for the website
              </FieldDescription>
            </FieldContent>

            <RadioGroup value={locale} onValueChange={onLocaleChange}  className='w-fit pr-4'>
              {[
                { value: 'ro', name: 'Romanian' },
                { value: 'ru', name: 'Russian' }
              ].map((item) => (
                <Field orientation="horizontal" key={item.value}>
                  <RadioGroupItem value={item.value} id={`locale-${item.value}`}/>
                  <FieldLabel htmlFor={`locale-${item.value}`} className="font-normal">
                    {item.name}
                  </FieldLabel>
                </Field>
              ))}
            </RadioGroup>
          </FieldSet>

          <FieldSeparator/>

          <Field orientation='responsive'>
            <FieldContent>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <FieldDescription>Change your name to the new one</FieldDescription>
            </FieldContent>

            <InputGroup className='flex-1 sm:max-w-xs mt-auto'>
              <InputGroupAddon>
                <IconLetterCase />
              </InputGroupAddon>
              <InputGroupInput placeholder={user?.name ?? "John Doe"}/>
              <InputGroupAddon align="inline-end">
                <InputGroupButton variant='ghost' size='icon-xs'>
                  <IconSend/>
                  <span className='sr-only'>Update</span>
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <FieldSeparator/>

          <Field orientation='responsive'>
            <FieldContent>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <FieldDescription>Change your email to the new one</FieldDescription>
            </FieldContent>

            <InputGroup className='flex-1 sm:max-w-xs mt-auto'>
              <InputGroupAddon>
                <IconMail />
              </InputGroupAddon>
              <InputGroupInput placeholder={user?.email ?? "johndoe@yahoo.com"}/>
              <InputGroupAddon align="inline-end">
                <InputGroupButton variant='ghost' size='icon-xs'>
                  <IconSend/>
                  <span className='sr-only'>Update</span>
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <FieldSeparator/>

          <Field orientation='responsive'>
            <FieldContent>
              <FieldLabel htmlFor="email">Request password reset</FieldLabel>
              <FieldDescription>Send email to reset password</FieldDescription>
            </FieldContent>

            <Button variant='outline' className=''>
              <IconMailForward/>
              <span>Send email</span>
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </main>
  );
}

const themeOptions = [
  {
    value: 'system',
    label: 'System',
    description: 'Match your system theme..',
    icon: IconDeviceImac
  },
  {
    value: 'light',
    label: 'Light',
    description: 'Always use the light theme.',
    icon: IconSun
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Always use the dark theme.',
    icon: IconMoon
  }
];