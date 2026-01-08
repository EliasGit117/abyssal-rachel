import { createFileRoute } from '@tanstack/react-router';
import {
  CreateCategorySheet,
  CreateCategorySheetProvider,
  CreateCategorySheetTrigger
} from '@/routes/admin/categories/-components/create-category-sheet';
import {
  CategoryTree,
  CategoryTreeProvider,
  CategoryTreeToolbar, useCategoryTree
} from '@/routes/admin/categories/-components/category-tree';
import { FC } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { IconRefresh } from '@tabler/icons-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';


export const Route = createFileRoute('/admin/categories/')({
  component: RouteComponent,
  staticData: {
    breadcrumbs: { title: 'Categories' }
  }
});

function RouteComponent() {
  return (
    <CategoryTreeProvider>
      <CreateCategorySheetProvider>
        <main className="container mx-auto p-4 space-y-4">
          <CategoryTreeToolbar>
            <ToolbarAdditionButtons/>
          </CategoryTreeToolbar>
          <CategoryTree/>
        </main>

        <CreateCategorySheet/>
      </CreateCategorySheetProvider>
    </CategoryTreeProvider>
  );
}



const ToolbarAdditionButtons: FC<{ disabled?: boolean }> = ({ disabled }) => {
  const { disabled: isTreeDisabled, refetch } = useCategoryTree();

  const isDisabled = isTreeDisabled || disabled;

  return (
    <>
      <div className='flex-1'/>

      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button size='sm' variant='ghost' className='w-8 sm:w-fit' onClick={() => refetch()} disabled={disabled}>
            <IconRefresh/>
            <span className="sr-only sm:not-sr-only">Refresh</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="sm:hidden">
          <p>Refresh</p>
        </TooltipContent>
      </Tooltip>

      <CreateCategorySheetTrigger size="sm" variant="ghost" disabled={isDisabled} className="w-8 sm:w-fit"/>
    </>
  );
};