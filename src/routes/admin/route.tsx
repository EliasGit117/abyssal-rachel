import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
  beforeLoad: ({ context: { session } }) => {
    console.log(session);
    if (!session)
      throw redirect({ to: '/auth/sign-in' })
  }
})

function RouteComponent() {
  return <div>Hello "/_admin"!</div>
}
