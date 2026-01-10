import { createFileRoute } from '@tanstack/react-router'
import { awaitIfServer } from '@/lib/await-if-server.ts';
import {
  getSessionsPaginatedAdminQueryOptions,
  getSessionsPaginatedAdminSchema
} from '@/features/auth/server-functions/admin/sessions-paginated.ts';
import { SessionsTable } from '@/routes/admin/sessions/-components/sessions-table/table.tsx';



export const Route = createFileRoute('/admin/sessions/')({
  component: RouteComponent,
  staticData: { breadcrumbs: { title: 'Sessions' } },
  head: () => ({ meta: [{ title: 'Sessions' }] }),
  validateSearch: getSessionsPaginatedAdminSchema,
  loaderDeps: (deps) => (deps),
  loader: async ({ context: { queryClient }, deps: { search } }) => {
    await awaitIfServer(queryClient.prefetchQuery(getSessionsPaginatedAdminQueryOptions(search)));
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
