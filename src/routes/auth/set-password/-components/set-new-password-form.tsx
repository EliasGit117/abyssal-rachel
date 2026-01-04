import * as z from 'zod';
import { ComponentProps, FC, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field.tsx';
import { m } from '@/paraglide/messages';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group.tsx';
import { IconEye, IconEyeOff } from '@tabler/icons-react';



export const setPasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: m['pages.auth.set_new_password.passwords_do_not_match']()
  });

export type TSetPasswordSchema = z.infer<typeof setPasswordSchema>;

interface IProps extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  id?: string;
  form: UseFormReturn<TSetPasswordSchema>;
  onSubmit: (data: TSetPasswordSchema) => void;
  disabled?: boolean;
}

export const SetPasswordForm: FC<IProps> = ({ form, id, onSubmit, disabled, ...props }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <form
      id={id ?? 'set-password-form'}
      onSubmit={form.handleSubmit(onSubmit)}
      method="post"
      {...props}
    >
      <fieldset disabled={disabled}>
        <FieldGroup>
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
                      aria-label={m['pages.auth.set_new_password.show_passwords']()}
                      title={m['pages.auth.set_new_password.show_passwords']()}
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

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="confirm-password-input">
                  {m['pages.auth.sign_up.confirm_password']()}
                </FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id="comfirm-password-input"
                    type={isPasswordVisible ? 'text' : 'password'}
                    aria-invalid={fieldState.invalid}
                    placeholder="*********"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      aria-label={m['pages.auth.set_new_password.show_passwords']()}
                      title={m['pages.auth.set_new_password.show_passwords']()}
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