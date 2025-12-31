import { ComponentProps, FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { FieldDescription } from '@/components/ui/field.tsx';
import { cn } from '@/lib/utils.ts';
import { IconSend } from '@tabler/icons-react';
import { Link, useRouter } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@/components/ui/loading-button.tsx';
import { useMutation } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client.ts';
import { toast } from 'sonner';
import { m } from '@/paraglide/messages';
import { SignUpForm, signUpSchema, TSignUpSchema } from './sign-up-form.tsx';
import { zodResolver } from '@hookform/resolvers/zod';



interface ISignUpCard extends ComponentProps<typeof Card> {}

export const SignUpCard: FC<ISignUpCard> = ({ className, ...props }) => {
  const router = useRouter();
  const form = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const { mutate: signIn, isPending  } = useMutation({
    mutationFn: (data: TSignUpSchema) => authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      callbackURL: '/auth/sign-in?alert=email_confirmed'
    }),
    onSuccess: (res) => {
      if (!res.error) {
        toast.success(m['common.success'](), {
          description: m['pages.sign_up.success_message'](),
          duration: 5000
        });
        router.navigate({ to: '/auth/sign-in' });
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
          {m['pages.sign_up.form_title']()}
        </CardTitle>
        <CardDescription>
          {m['pages.sign_up.form_description']()}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <SignUpForm form={form} onSubmit={signIn} disabled={isPending} id="sign-in-form"/>
      </CardContent>

      <CardFooter className='flex-col gap-2'>
        <LoadingButton className='w-full' loading={isPending} form="sign-in-form">
          <IconSend/>
          <span>{m['common.submit']()}</span>
        </LoadingButton>

        <FieldDescription className="text-center">
          {m['pages.sign_up.already_have_account']()} <Link to="/auth/sign-in">{m['pages.sign_up.sign_in']()}</Link>
        </FieldDescription>
      </CardFooter>
    </Card>
  );
};