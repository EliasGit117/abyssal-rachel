import { createFileRoute } from '@tanstack/react-router'
import z from 'zod';
import { SetPasswordCard } from '@/routes/auth/set-password/-components';

const searchParamSchema = z.object({
  token: z.string().min(1),
})

export const Route = createFileRoute('/auth/set-password/')({
  component: RouteComponent,
  validateSearch: searchParamSchema,
  loaderDeps: ({ search }) => (search),

})

function RouteComponent() {
  const { token } = Route.useSearch();

  return (
    <SetPasswordCard className='mx-auto my-auto' token={token}/>
  )
}
