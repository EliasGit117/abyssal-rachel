import { createFileRoute } from '@tanstack/react-router'
import { awaitIfServer } from '@/lib/server/await-if-server.ts';
import { SessionsTable } from '@/routes/admin/sessions/-components/sessions-table/table.tsx';
import { orpc } from '@/lib/orpc';
import { listSessionsSchema } from '@/features/sessions/dtos/list-sessions-dto.ts';


export const Route = createFileRoute('/admin/sessions/')({
  component: RouteComponent,
  staticData: { crumbs: { title: 'Sessions' } },
  head: () => ({ meta: [{ title: 'Sessions' }] }),
  validateSearch: listSessionsSchema,
  loaderDeps: (deps) => (deps),
  loader: async ({ context: { queryClient }, deps: { search } }) => {
    await awaitIfServer(queryClient.prefetchQuery({
      ...orpc.admin.sessions.list.queryOptions({ input: search }),
      staleTime: Infinity,
    }));
  },
})

function RouteComponent() {
  const search = Route.useSearch();

  return (
    <main className="container mx-auto p-4 flex flex-col gap-4">
      <SessionsTable search={search}/>
    </main>
  );
}
