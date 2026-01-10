import { createFileRoute } from '@tanstack/react-router';
import { UsersTable } from '@/routes/admin/users/-components/users-table/table.tsx';
import {
  getUsersPaginatedAdminQueryOptions,
  getUsersPaginatedAdminSchema
} from '@/features/auth/server-functions/admin/users-paginated.ts';
import { awaitIfServer } from '@/lib/await-if-server.ts';


export const Route = createFileRoute('/admin/users/')({
  component: RouteComponent,
  staticData: { breadcrumbs: { title: 'Users' } },
  head: () => ({ meta: [{ title: 'Users' }] }),
  validateSearch: getUsersPaginatedAdminSchema,
  loaderDeps: (deps) => (deps),
  loader: async ({ context: { queryClient }, deps: { search } }) => {
    await awaitIfServer(queryClient.prefetchQuery(getUsersPaginatedAdminQueryOptions(search)));
  },
});

function RouteComponent() {
  const search = Route.useSearch();

  return (
    <main className="container mx-auto p-4 flex flex-col gap-4">
      <UsersTable search={search}/>
    </main>
  );
}
