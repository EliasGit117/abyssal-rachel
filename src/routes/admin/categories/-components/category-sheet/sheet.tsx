import { FC, useEffect } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { IconSend, IconX } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  createCategorySchema, TCreateCategory, TUpdateCategory,
  updateCategorySchema
} from '@/features/categories/admin/schemas';
import { CategoryStatus } from '~/prisma/generated/prisma/enums';

import { useCategorySheet } from './provider';
import { useCreateCategoryMutation } from '@/features/categories/admin/server-functions/create';
import { useUpdateCategoryMutation } from '@/features/categories/admin/server-functions/update';
import { useQuery } from '@tanstack/react-query';
import { getCategoryByIdForAdminQueryOptions } from '@/features/categories/admin/server-functions/get-by-id';
import { CategoryForm } from '@/routes/admin/categories/-components/category-sheet/form.tsx';
import { Spinner } from '@/components/ui/spinner.tsx';

export const CategorySheet: FC = () => {
  const { isOpen, options, close } = useCategorySheet();

  const mode = options?.mode;

  const { data: category, isLoading: isLoadingCategory } = useQuery({
    ...getCategoryByIdForAdminQueryOptions(options?.categoryId!),
    enabled: (mode === 'edit' && !!options?.categoryId),
    staleTime: 0,
    gcTime: 0
  });

  const form = useForm<TUpdateCategory | TCreateCategory>({
    resolver: zodResolver(mode === 'edit' ? updateCategorySchema : createCategorySchema),
    defaultValues: {
      parentId: options?.parentId,
      slug: '',
      nameRo: '',
      nameRu: '',
      descriptionRo: '',
      descriptionRu: '',
      status: CategoryStatus.ACTIVE
    }
  });

  useEffect(() => {
    if (!isOpen)
      return;

    if (mode === 'edit' && category) {
      form.reset({
        id: category.id,
        parentId: category.parentId,
        slug: category.slug,
        nameRo: category.nameRo,
        nameRu: category.nameRu,
        descriptionRo: category.descriptionRo ?? '',
        descriptionRu: category.descriptionRu ?? '',
        status: category.status
      });
    }
  }, [isOpen, mode, category]);

  const { mutate: create, isPending: creating } =
    useCreateCategoryMutation({
      onSuccess: close,
      onError: (e) =>
        toast.error(e.name, { description: e.message })
    });

  const { mutate: update, isPending: updating } =
    useUpdateCategoryMutation({
      onSuccess: close,
      onError: (e) =>
        toast.error(e.name, { description: e.message })
    });

  const onSubmit = (data: TUpdateCategory | TCreateCategory) => {
    if (mode === 'edit') {
      update({ ...data, id: options!.categoryId! });
    } else {
      create(data);
    }
  };

  useEffect(() => {
    if (!isOpen)
      return;

    if (mode === 'edit') {
      if (!category) return;

      form.reset({
        id: category.id,
        parentId: category.parentId,
        slug: category.slug,
        nameRo: category.nameRo,
        nameRu: category.nameRu,
        descriptionRo: category.descriptionRo ?? '',
        descriptionRu: category.descriptionRu ?? '',
        status: category.status
      });

      return;
    }

    form.reset({
      parentId: options?.parentId ?? undefined,
      slug: '',
      nameRo: '',
      nameRu: '',
      descriptionRo: '',
      descriptionRu: '',
      status: CategoryStatus.ACTIVE
    });
  }, [isOpen, mode, category, options?.parentId]);

  const onOpenChange = (v: boolean) => {
    if (creating || updating || v)
      return;

    close();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full! max-w-full! sm:max-w-full! md:max-w-2xl! gap-0 border-l-0! md:border-l!"
        showCloseButton={false}
      >
        {isLoadingCategory && <Spinner className="absolute top-8 right-8"/>}

        <SheetHeader className="text-left">
          <SheetTitle>
            <span>{mode === 'edit' ? 'Edit category' : 'Create category'}</span>
          </SheetTitle>
          <SheetDescription>
            {mode === 'edit' ? 'Update category' : 'Create new category'}
          </SheetDescription>
        </SheetHeader>


        <ScrollArea className="flex-1 overflow-y-auto mr-2 my-2">
          <CategoryForm
            form={form}
            className="px-4"
            onSubmit={onSubmit}
            loading={isLoadingCategory}
            disabled={creating || updating || (mode === 'edit' && (!category || isLoadingCategory))}
            disabledIds={mode === 'edit' && options?.categoryId ? [options.categoryId] : []}
          />
        </ScrollArea>

        <SheetFooter className="flex flex-col sm:flex-row gap-4 justify-between items-end pt-0">
          <div className="flex flex-row sm:justify-end gap-2 w-full">
            <SheetClose className="grow sm:grow-0 sm:min-w-32" asChild>
              <Button variant="outline" disabled={creating || updating}>
                <IconX/>
                <span>Close</span>
              </Button>
            </SheetClose>

            <LoadingButton
              loadingText="Loading"
              form="category-form"
              className="grow sm:min-w-32 sm:grow-0"
              disabled={isLoadingCategory}
              loading={creating || updating}
            >
              <IconSend/>
              <span>Submit</span>
            </LoadingButton>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};