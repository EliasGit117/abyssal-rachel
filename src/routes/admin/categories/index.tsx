import { createFileRoute } from '@tanstack/react-router';
import {
  CategoryTree,
  CategoryTreeProvider,
  CategoryTreeToolbar,
  useCategoryTree
} from '@/routes/admin/categories/-components/category-tree';
import { FC } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { IconRefresh } from '@tabler/icons-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { getCategoryTreeForAdminQueryOptions } from '@/features/categories/admin/server-functions/get-tree.ts';
import { useIsMobile } from '@/hooks/use-mobile.ts';
import { useHasPermissions } from '@/hooks/use-has-permission.ts';
import { Permission } from '@/lib/auth/permissions.ts';
import {
  CategorySheet,
  CategorySheetTrigger,
  CategorySheetProvider
} from '@/routes/admin/categories/-components/category-sheet';

const title = 'Categories';

export const Route = createFileRoute('/admin/categories/')({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    if (typeof window === 'undefined')
      return;

    void queryClient.prefetchQuery(getCategoryTreeForAdminQueryOptions());
  },
  head: () => ({ meta: [{ title: title }] }),
  staticData: { crumbs: { title: title } }
});

function RouteComponent() {

  return (
    <CategorySheetProvider>
      <CategoryTreeProvider>

        <main className="container mx-auto p-4 space-y-4">
          <CategoryTreeToolbar>
            <ToolbarAdditionalButtons/>
          </CategoryTreeToolbar>

          <CategoryTree/>
        </main>

        <CategorySheet/>
      </CategoryTreeProvider>
    </CategorySheetProvider>
  );
}


const ToolbarAdditionalButtons: FC<{ disabled?: boolean }> = ({ disabled }) => {
  const { disabled: isTreeDisabled, refetch } = useCategoryTree();
  const isMobile = useIsMobile();
  const { canCreate } = useHasPermissions({
    canCreate: { category: [Permission.Create] }
  });

  const isDisabled = isTreeDisabled || disabled;

  const refreshButton = (
    <Button
      size="sm"
      variant="ghost"
      className="w-8 sm:w-fit"
      onClick={() => refetch()}
      disabled={isDisabled}
    >
      <IconRefresh/>
      <span className="sr-only sm:not-sr-only">Refresh</span>
    </Button>
  );

  return (
    <>
      <div className="flex-1"/>

      {isMobile ? (
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>{refreshButton}</TooltipTrigger>
          <TooltipContent>
            <p>Refresh</p>
          </TooltipContent>
        </Tooltip>
      ) : (refreshButton)}

      {canCreate && (
        <CategorySheetTrigger
          options={{ mode: 'create' }}
          size="sm"
          variant="ghost"
          disabled={isDisabled}
          className="w-8 sm:w-fit"
        />
      )}
    </>
  );
};