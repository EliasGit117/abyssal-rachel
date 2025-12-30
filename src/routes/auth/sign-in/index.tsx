import { createFileRoute } from '@tanstack/react-router'
import { SignInCard } from '@/routes/auth/sign-in/-components';

export const Route = createFileRoute('/auth/sign-in/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SignInCard className='mx-auto my-auto'/>
  )
}
