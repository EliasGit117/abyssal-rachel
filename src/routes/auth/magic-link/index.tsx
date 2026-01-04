import { createFileRoute, redirect } from '@tanstack/react-router';
import { MagicLinkCard } from '@/routes/auth/magic-link/-components';

export const Route = createFileRoute('/auth/magic-link/')({
  component: RouteComponent,
  beforeLoad: ({ context: { session } }) => {
    if (session)
      throw redirect({ to: '/' })
  },
})

function RouteComponent() {

  return (
    <MagicLinkCard className='mx-auto my-auto'/>
  )
}
