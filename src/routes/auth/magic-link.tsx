import { createFileRoute, redirect } from '@tanstack/react-router';
import { MagicLinkCard } from '@/components/auth/magic-link-card';


export const Route = createFileRoute('/auth/magic-link')({
  component: RouteComponent,
  beforeLoad: ({ context: { session } }) => {
    if (session)
      throw redirect({ to: '/' })
  },
})

function RouteComponent() {

  return (
    <MagicLinkCard className='mx-auto my-auto' goBackPath='/auth/sign-in'/>
  )
}
