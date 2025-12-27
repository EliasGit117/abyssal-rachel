import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button.tsx';
import { IconSend } from '@tabler/icons-react';

export const Route = createFileRoute('/_public/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className='container mx-auto p-4 space-y-4 min-h-svh'>
      <h1 className='text-2xl font-bold'>Public Route</h1>
      <Button>
        <IconSend/>
        <span>Send</span>
      </Button>
    </main>
  )
}
