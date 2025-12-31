import { ComponentProps, FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { FieldDescription } from '@/components/ui/field.tsx';
import { cn } from '@/lib/utils.ts';
import { IconSend } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { SignInForm, signInSchema, TSignInSchema } from '@/routes/auth/sign-in/-components/sign-in-form.tsx';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@/components/ui/loading-button.tsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client.ts';
import { toast } from 'sonner';
import { m } from '@/paraglide/messages';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSessionQueryOptions } from '@/features/auth/server-functions/get-session.ts';


interface ISignInCard extends ComponentProps<typeof Card> {
}

export const SignInCard: FC<ISignInCard> = ({ className, ...props }) => {
  const queryClient = useQueryClient();
  const form = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' }
  });

  const { mutate: signIn, isPending  } = useMutation({
    mutationFn: ({ email, password }: TSignInSchema) => authClient.signIn.email({ email, password }),
    onSuccess: (res) => {
      if (!res.error) {
        void queryClient.invalidateQueries({ queryKey: getSessionQueryOptions().queryKey });
        return;
      }

      throw new Error(res.error.message);
    },
    onError: (e) => {
      toast.error(m['common.error'](), { description: e.message })
    }
  });

  return (
    <Card className={cn('w-full max-w-sm', className)} {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {m['pages.sign_in.form_title']()}
        </CardTitle>
        <CardDescription>
          {m['pages.sign_in.form_description']()}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <SignInForm form={form} onSubmit={signIn} disabled={isPending} id="sign-in-form"/>
      </CardContent>

      <CardFooter className='flex-col gap-2'>
        <LoadingButton className='w-full' loading={isPending} form="sign-in-form">
          <IconSend/>
          <span>{m['common.submit']()}</span>
        </LoadingButton>

        <FieldDescription className="text-center">
          {m['pages.sign_in.dont_have_account']()} <Link to="/auth/sign-up">{m['pages.sign_in.create']()}</Link>
        </FieldDescription>
      </CardFooter>
    </Card>
  );
};