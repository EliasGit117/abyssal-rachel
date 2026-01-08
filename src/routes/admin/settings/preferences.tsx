import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/settings/preferences')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/settings/preferences"!</div>
}
