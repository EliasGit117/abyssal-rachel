import { RPCHandler } from '@orpc/server/fetch';
import { createFileRoute } from '@tanstack/react-router';
import { orpcRouter } from '@/features/shared/orpc/router.ts';
import { getRequestHeaders } from '@tanstack/react-start/server';

const handler = new RPCHandler(orpcRouter);

async function handle({ request }: { request: Request }) {
  const { response } = await handler.handle(request, {
    prefix: '/__rpc',
    context: {
      headers: getRequestHeaders()
    }
  });

  return response ?? new Response('Not Found', { status: 404 });
}

export const Route = createFileRoute('/api/rpc/$')({
  server: {
    handlers: {
      HEAD: handle,
      GET: handle,
      POST: handle,
      PUT: handle,
      PATCH: handle,
      DELETE: handle
    }
  }
});
