import { createFileRoute } from '@tanstack/react-router'
import { ResetPasswordCard } from '@/routes/auth/reset-password/-components';

export const Route = createFileRoute('/auth/reset-password/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ResetPasswordCard className='mx-auto my-auto'/>
  )
}
