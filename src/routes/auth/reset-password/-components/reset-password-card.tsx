import { ComponentProps, FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { cn } from '@/lib/utils.ts';
import { IconArrowBackUp, IconSend } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@/components/ui/loading-button.tsx';
import { useMutation } from '@tanstack/react-query';
import { authClient } from '@/features/auth/lib/auth-client.ts';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { magicLinkSchema, MagicLinkForm, TMagicLinkschema } from '@/routes/auth/magic-link/-components/magic-link-schema.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from '@tanstack/react-router';
import { m } from '@/paraglide/messages';


interface IProps extends ComponentProps<typeof Card> {}

export const ResetPasswordCard: FC<IProps> = ({ className, ...props }) => {
  const form = useForm<TMagicLinkschema>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: '' }
  });

  const { mutate: signIn, isPending } = useMutation({
    mutationFn: ({ email }: TMagicLinkschema) => authClient.requestPasswordReset({
      email: email,
      redirectTo: '/auth/set-password'
    }),
    onSuccess: (res) => {
      if (!res.error) {
        toast.success(m['pages.auth.reset_password.success_message']());
        form.reset({ email: '' });
        return;
      }

      throw new Error(res.error.message);
    },
    onError: (e) => {
      toast.error(m['common.error'](), { description: e.message });
    }
  });

  return (
    <Card className={cn('w-full max-w-sm', className)} {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {m['pages.auth.reset_password.form_title']()}
        </CardTitle>
        <CardDescription>
          {m['pages.auth.reset_password.form_description']()}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <MagicLinkForm form={form} onSubmit={signIn} disabled={isPending} id="magic-link-form"/>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <LoadingButton className="w-full" loading={isPending} form="magic-link-form">
          <IconSend/>
          <span>{m['common.submit']()}</span>
        </LoadingButton>

        <Button variant="link" size="sm" className="w-full" asChild>
          <Link to="/auth/sign-in">
            <IconArrowBackUp/>
            <span>{m['common.go_back']()}</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};