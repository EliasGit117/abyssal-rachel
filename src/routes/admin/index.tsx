import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className='container mx-auto p-4'>
      <h1>Admin page</h1>
    </main>
  )
}
