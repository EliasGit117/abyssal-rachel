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
import { SetPasswordForm, setPasswordSchema, TSetPasswordSchema } from './form.tsx';
import { LinkOptions, useRouter } from '@tanstack/react-router';




interface IProps extends ComponentProps<typeof Card> {
  token: string;
  onSuccessNavigateTo?: LinkOptions['to'];
}

export const SetNewPasswordCard: FC<IProps> = ({ className, token, onSuccessNavigateTo, ...props }) => {
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
        toast.success(m['components.auth.set_new_password_card.success_message']());

        if (!!onSuccessNavigateTo)
          router.navigate({ to: onSuccessNavigateTo, replace: true });

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
          {m['components.auth.set_new_password_card.title']()}
        </CardTitle>
        <CardDescription>
          {m['components.auth.set_new_password_card.description']()}
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