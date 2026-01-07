import { createFileRoute } from '@tanstack/react-router';
import {
  CreateCategorySheet,
  CreateCategorySheetProvider,
  CreateCategorySheetTrigger
} from '@/routes/admin/categories/-components/create-category-sheet';
import { CategoryTree } from '@/routes/admin/categories/-components/category-tree';

export const Route = createFileRoute('/admin/categories/')({
  component: RouteComponent,
  staticData: {
    breadcrumbs: { title: 'Categories' }
  }
});

function RouteComponent() {
  return (
    <CreateCategorySheetProvider>
      <main className="container mx-auto p-4 space-y-4">
        <div className="flex gap-2">
          <CreateCategorySheetTrigger size="sm" variant="ghost" className="ml-auto w-8 sm:w-fit"/>
        </div>

        <CategoryTree/>
      </main>

      <CreateCategorySheet/>
    </CreateCategorySheetProvider>
  );
}
