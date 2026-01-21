import { createFileRoute, redirect } from '@tanstack/react-router';
import { SignUpCard } from '@/components/auth/sign-up-card';

export const Route = createFileRoute('/auth/sign-up')({
  component: RouteComponent,
  beforeLoad: ({ context: { session } }) => {
    if (session)
      throw redirect({ to: '/' })
  },
})

function RouteComponent() {

  return (
    <SignUpCard className='mx-auto my-auto' signInPath='/auth/sign-in' />
  );
}
