import { createFileRoute } from '@tanstack/react-router'
import { SignUpCard } from '@/routes/auth/sign-up/-components';

export const Route = createFileRoute('/auth/sign-up/')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <SignUpCard className='mx-auto my-auto'/>
  );
}
