import * as z from 'zod';
import { ComponentProps, FC } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import { m } from '@/paraglide/messages';


export const resetPasswordSchema = z.object({
  email: z.email(),
});

export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

interface IProps extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  id?: string;
  form: UseFormReturn<TResetPasswordSchema>;
  onSubmit: (data: TResetPasswordSchema) => void;
  disabled?: boolean;
}

export const ResetPasswordForm: FC<IProps> = ({ form, id, onSubmit, disabled, ...props }) => {

  return (
    <form
      id={id ?? 'reset-password-form'}
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
        </FieldGroup>
      </fieldset>
    </form>
  );
};