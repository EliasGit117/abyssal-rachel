import * as z from 'zod';
import { ComponentProps, FC, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import { m } from '@/paraglide/messages';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group.tsx';
import { IconEye, IconEyeOff } from '@tabler/icons-react';


export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
});

export type TSignInSchema = z.infer<typeof signInSchema>;

interface IProps extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  id?: string;
  form: UseFormReturn<TSignInSchema>;
  onSubmit: (data: TSignInSchema) => void;
  disabled?: boolean;
}

export const SignInForm: FC<IProps> = ({ form, id, onSubmit, disabled, ...props }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <form
      id={id ?? 'sign-in-form'}
      onSubmit={form.handleSubmit(onSubmit)}
      method="post"
      {...props}
    >
      <fieldset disabled={disabled}>
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email-input">
                  {m['common.email']()}
                </FieldLabel>
                <Input
                  {...field}
                  id="email-input"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="johndoe@yahoo.com"
                />
                {fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password-input">
                  {m['common.password']()}
                </FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id="password-input"
                    type={isPasswordVisible ? 'text' : 'password'}
                    aria-invalid={fieldState.invalid}
                    placeholder="*********"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      aria-label={m['pages.sign_up.show_passwords']()}
                      title={m['pages.sign_up.show_passwords']()}
                      onClick={() => setIsPasswordVisible(pv => !pv)}
                    >
                      {isPasswordVisible ? <IconEye/> : <IconEyeOff/>}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)}
              </Field>
            )}
          />
        </FieldGroup>
      </fieldset>
    </form>
  );
};