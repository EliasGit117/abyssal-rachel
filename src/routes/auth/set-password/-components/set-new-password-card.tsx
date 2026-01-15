import { ComponentProps, FC } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card.tsx';
import { cn } from '@/lib/utils';
import { IconSend } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@/components/ui/loading-button.tsx';
import { useMutation } from '@tanstack/react-query';
import { authClient } from '@/lib/auth/auth-client.ts';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { m } from '@/paraglide/messages';
import { SetPasswordForm, setPasswordSchema, TSetPasswordSchema } from './set-new-password-form.tsx';
import { useRouter } from '@tanstack/react-router';




interface IProps extends ComponentProps<typeof Card> {
  token: string;
}

export const SetPasswordCard: FC<IProps> = ({ className, token, ...props }) => {
  const router = useRouter();
  const form = useForm<TSetPasswordSchema>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const { mutate: setPassword, isPending } = useMutation({
    mutationFn: ({ password }: TSetPasswordSchema) => authClient.resetPassword({ token: token, newPassword: password }),
    onSuccess: (res) => {
      if (!res.error) {
        form.reset({ password: '', confirmPassword: '' });
        toast.success(m['pages.auth.set_new_password.success_message']());
        router.navigate({ to: '/', replace: true });
        return;
      }

      throw new Error(res.error.message);
    },
    onError: (e: Error) => {
      toast.error(m['common.error'](), { description: e.message });
    }
  });

  return (
    <Card className={cn('w-full max-w-sm', className)} {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {m['pages.auth.set_new_password.form_title']()}
        </CardTitle>
        <CardDescription>
          {m['pages.auth.set_new_password.form_description']()}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <SetPasswordForm form={form} id="set-password-form" onSubmit={setPassword} disabled={isPending}/>
      </CardContent>

      <CardFooter>
        <LoadingButton
          className="w-full"
          loading={isPending}
          form="set-password-form"
        >
          <IconSend />
          <span>{m['common.submit']()}</span>
        </LoadingButton>
      </CardFooter>
    </Card>
  );
};