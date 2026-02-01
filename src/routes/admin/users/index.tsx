import { createFileRoute } from '@tanstack/react-router';
import { UsersTable } from '@/routes/admin/users/-components/users-table/table.tsx';
import { awaitIfServer } from '@/lib/server/await-if-server.ts';
import { orpc } from '@/lib/orpc';
import { listUsersSchema } from '@/features/users/dtos/list-users-dto.ts';


export const Route = createFileRoute('/admin/users/')({
  component: RouteComponent,
  staticData: { crumbs: { title: 'Users' } },
  head: () => ({ meta: [{ title: 'Users' }] }),
  validateSearch: listUsersSchema,
  loaderDeps: (deps) => (deps),
  loader: async ({ context: { queryClient }, deps: { search } }) => {
    await awaitIfServer(queryClient.prefetchQuery({
      ...orpc.admin.users.list.queryOptions({ input: search }),
      staleTime: Infinity,
    }));
  }
});

function RouteComponent() {
  const search = Route.useSearch();

  return (
    <main className="container mx-auto p-4 flex flex-col gap-4">
      <UsersTable search={search}/>
    </main>
  );
}
