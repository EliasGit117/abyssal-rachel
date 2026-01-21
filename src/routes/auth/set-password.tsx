import { createFileRoute, ErrorComponent } from '@tanstack/react-router';
import z from 'zod';
import { SetNewPasswordCard } from '@/components/auth/set-new-password-card';


const searchParamSchema = z.object({
  token: z.string().min(1),
})

export const Route = createFileRoute('/auth/set-password')({
  component: RouteComponent,
  validateSearch: searchParamSchema,
  errorComponent: ErrorComponent,
  loaderDeps: ({ search }) => (search),
})

function RouteComponent() {
  const { token } = Route.useSearch();

  return (
    <SetNewPasswordCard className='mx-auto my-auto' token={token} onSuccessNavigateTo='/auth/sign-in'/>
  )
}
