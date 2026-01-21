import { createFileRoute } from '@tanstack/react-router'
import { SessionsCard } from '@/components/auth/sessions-card';

export const Route = createFileRoute('/admin/settings/security')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='@container'>
      <div className='grid @2xl:grid-cols-5 gap-4'>
        <SessionsCard className='@2xl:col-span-3' translated={false}/>
      </div>
    </div>
  )
}
