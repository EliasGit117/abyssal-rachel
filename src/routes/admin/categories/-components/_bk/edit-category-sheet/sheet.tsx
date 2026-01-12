import { FC, useEffect } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoryStatus } from '~/prisma/generated/prisma/enums.ts';
import { IconAlertTriangle, IconSend, IconX } from '@tabler/icons-react';
import { LoadingButton } from '@/components/ui/loading-button.tsx';
import { toast } from 'sonner';
import { EditCategoryForm } from '@/routes/admin/categories/-components/_bk/category-form';
import {
  TUpdateCategory,
  updateCategorySchema
} from '@/features/categories/admin/schemas';
import { useUpdateCategoryMutation } from '@/features/categories/admin/server-functions/update.ts';
import { useEditCategorySheet } from './provider.tsx';
import { useQuery } from '@tanstack/react-query';
import { getCategoryByIdForAdminQueryOptions } from '@/features/categories/admin/server-functions/get-by-id.ts';


interface IProps {}

export const EditCategorySheet: FC<IProps> = () => {
  const { isOpen, close, categoryId } = useEditCategorySheet();

  const {
    data: category,
    isPending: isPendingCategory,
    isError,
    error
  } = useQuery({
    ...getCategoryByIdForAdminQueryOptions(categoryId!),
    enabled: !!categoryId,
    staleTime: 0,
    gcTime: 0,
    retry: 3
  });

  const form = useForm<TUpdateCategory>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      id: categoryId,
      slug: '',
      nameRo: '',
      nameRu: '',
      descriptionRo: '',
      descriptionRu: '',
      status: CategoryStatus.ACTIVE,
      parentId: null
    }
  });

  useEffect(() => {
    if (isOpen)
      form.reset();

    if (!category)
      return;

    form.reset({
      id: category.id,
      slug: category.slug,
      nameRo: category.nameRo,
      nameRu: category.nameRu,
      descriptionRo: category.descriptionRo ?? '',
      descriptionRu: category.descriptionRu ?? '',
      status: category.status,
      parentId: category.parentId
    }, { keepDirtyValues: false });
  }, [category?.id, form, isOpen]);

  const { mutate: updateCtg, isPending: isUpdatingCtg } =
    useUpdateCategoryMutation({
      onSuccess: () => {
        form.reset();
        close();
      },
      onError: (e) =>
        toast.error(e.name, { description: e.message })
    });

  const onOpenChange = (value: boolean) => {
    if (isUpdatingCtg || value) return;
    close();
  };


  const hasError = isError && !isPendingCategory;
  const canEdit = !!category && !hasError;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full! max-w-full! sm:max-w-full! md:max-w-2xl! gap-0 border-l-0! md:border-l!"
        showCloseButton={false}
      >
        <SheetHeader className="text-left">
          <SheetTitle>Edit category</SheetTitle>
          <SheetDescription>
            Fill the fields below to edit the category
          </SheetDescription>
        </SheetHeader>

        {(!isPendingCategory && hasError) ? (
          <div className="flex items-center justify-center h-full px-4">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconAlertTriangle/>
                </EmptyMedia>
                <EmptyTitle>Error</EmptyTitle>
                <EmptyDescription>
                  {error?.message ?? `Failed to get category with id: ${categoryId}`}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        ) : (
          <ScrollArea className="flex-1 overflow-y-auto mr-2 my-2">
            <EditCategoryForm
              className="px-4"
              form={form}
              onSubmit={updateCtg}
              disabledIds={categoryId ? [categoryId] : []}
              disabled={isPendingCategory || isUpdatingCtg}
              id="edit-category-form"
            />
          </ScrollArea>
        )}

        <SheetFooter className="flex flex-col sm:flex-row gap-4 justify-between items-end pt-0">
          <div className="flex flex-row sm:justify-end gap-2 w-full">
            <SheetClose
              className="grow sm:grow-0 sm:min-w-32"
              asChild
            >
              <Button variant="outline" disabled={isUpdatingCtg}>
                <IconX/>
                <span>Close</span>
              </Button>
            </SheetClose>

            {canEdit && !isPendingCategory && (
              <LoadingButton
                loadingText="Loading"
                form="edit-category-form"
                className="grow sm:min-w-32 sm:grow-0"
                loading={isUpdatingCtg}
              >
                <IconSend/>
                <span>Submit</span>
              </LoadingButton>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};