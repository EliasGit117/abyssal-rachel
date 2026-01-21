import { ComponentProps, FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { cn } from '@/lib/utils';
import { IconArrowBackUp, IconSend } from '@tabler/icons-react';
import { Controller, useForm } from 'react-hook-form';
import { LoadingButton } from '@/components/ui/loading-button.tsx';
import { useMutation } from '@tanstack/react-query';
import { authClient } from '@/lib/auth/auth-client.ts';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { m } from '@/paraglide/messages';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import * as z from 'zod';
import { Button } from '@/components/ui/button.tsx';
import { Link, LinkOptions } from '@tanstack/react-router';

export const resetPasswordSchema = z.object({
  email: z.email()
});

export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

const ENGLISH_MESSAGES = {
  title: 'Reset Password',
  description: 'Enter your email to reset your password',
  email: 'Email',
  submit: 'Submit',
  successMessage: 'Password reset email sent',
  error: 'Error'
};

interface IProps extends ComponentProps<typeof Card> {
  type?: 'centered' | 'default';
  translated?: boolean;
  goBackPath?: LinkOptions['to'];
}

export const ResetPasswordCard: FC<IProps> = ({ className, type, translated = true, goBackPath, ...props }) => {
  const getText = (key: keyof typeof ENGLISH_MESSAGES, fallback: string = '') => {
    if (!translated)
      return ENGLISH_MESSAGES[key];

    switch (key) {
      case 'title':
        return m['components.reset_password_card.form_title']();
      case 'description':
        return m['components.reset_password_card.form_description']();
      case 'email':
        return m['common.email']();
      case 'submit':
        return m['common.submit']();
      case 'successMessage':
        return m['components.reset_password_card.success_message']();
      case 'error':
        return m['common.error']();
      default:
        return fallback;
    }
  };

  const form = useForm<TResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' }
  });

  const { mutate: requestResetPassword, isPending } = useMutation({
    mutationFn: ({ email }: TResetPasswordSchema) =>
      authClient.requestPasswordReset({
        email: email,
        redirectTo: '/auth/set-password'
      }),
    onSuccess: (res) => {
      if (!res.error) {
        toast.success(getText('successMessage'));
        form.reset({ email: '' });
        return;
      }
      throw new Error(res.error.message);
    },
    onError: (e) => {
      toast.error(getText('error'), { description: e.message });
    }
  });

  const onSubmit = (data: TResetPasswordSchema) => requestResetPassword(data);

  return (
    <Card className={cn('w-full max-w-sm @container', className)} {...props}>
      <CardHeader className={cn(type === 'centered' && 'text-center')}>
        <CardTitle className="text-xl">{getText('title')}</CardTitle>
        <CardDescription>{getText('description')}</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="reset-password-form"
          onSubmit={form.handleSubmit(onSubmit)}
          method="post"
        >
          <fieldset disabled={isPending}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email-input">
                      {getText('email')}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="email-input"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="johndoe@yahoo.com"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]}/>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </fieldset>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <LoadingButton
          className="w-full @md:w-auto @md:ml-auto"
          loading={isPending}
          form="reset-password-form"
        >
          <IconSend/>
          <span>{getText('submit')}</span>
        </LoadingButton>

        {!!goBackPath && (
          <Button variant="secondary" className="w-full" asChild>
            <Link to={goBackPath}>
              <IconArrowBackUp/>
              <span>{m['common.go_back']()}</span>
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};