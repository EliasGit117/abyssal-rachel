import { createFileRoute } from '@tanstack/react-router'
import { EditNameCard } from '@/components/auth';

export const Route = createFileRoute('/admin/settings/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className='container mx-auto space-y-4'>
      <EditNameCard translated={false} />
    </main>
  )
}
