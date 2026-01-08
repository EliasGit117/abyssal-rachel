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
import { useCreateCategorySheet } from '@/routes/admin/categories/-components/create-category-sheet/provider.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { useForm } from 'react-hook-form';
import { createCategorySchema, TCreateCategory } from '@/features/categories/admin/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoryStatus } from '~/prisma/generated/prisma/enums.ts';
import { IconSend, IconX } from '@tabler/icons-react';
import { useCreateCategoryMutation } from '@/features/categories/admin/server-functions/create.ts';
import { LoadingButton } from '@/components/ui/loading-button.tsx';
import { toast } from 'sonner';
import { CreateCategoryForm } from '@/routes/admin/categories/-components/category-form';



interface IProps {}

export const CreateCategorySheet: FC<IProps> = ({}) => {
  const { isOpen, open, close, options } = useCreateCategorySheet();
  const form = useForm<TCreateCategory>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: getDefaultValues({ parentId: options?.parentId })
  });

  useEffect(() => {
    if (!isOpen)
      return;

    form.reset(getDefaultValues({ parentId: options?.parentId }));
  }, [isOpen, options?.parentId]);

  const { mutate: createCtg, isPending: isCreatingCtg } = useCreateCategoryMutation({
    onSuccess: () => {
      form.reset();
      close();
    },
    onError: (e) => toast.error(e.name, { description: e.message })
  });

  const onOpenChange = (value: boolean) => {
    if (isCreatingCtg)
      return;

    if (value) {
      open();
      return;
    }

    close();
  };


  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full! max-w-full! sm:max-w-full! md:max-w-2xl! gap-0 border-l-0! md:border-l!"
        showCloseButton={false}
      >
        <SheetHeader className="text-left">
          <SheetTitle>Create category</SheetTitle>
          <SheetDescription>
            Fill the fields lower to create new category
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-y-auto mr-2 my-2" type="auto">
          <CreateCategoryForm
            className="px-4"
            form={form}
            onSubmit={createCtg}
            disabled={isCreatingCtg}
            id="create-category-form"
          />
        </ScrollArea>

        <SheetFooter className="flex flex-col sm:flex-row gap-4 justify-between items-end pt-0">
          <div className="flex flex-row sm:justify-end gap-2 w-full">
            <SheetClose className="grow sm:grow-0 sm:min-w-32" asChild>
              <Button variant="outline" disabled={isCreatingCtg}>
                <IconX/>
                <span>Close</span>
              </Button>
            </SheetClose>

            <LoadingButton
              loadingText="Loading"
              form="create-category-form"
              className="grow sm:min-w-32 sm:grow-0"
              loading={isCreatingCtg}
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


function getDefaultValues(values?: Partial<TCreateCategory>) {
  return {
    parentId: values?.parentId ?? undefined,
    slug: values?.slug ?? '',
    nameRo: values?.nameRo ?? '',
    nameRu: values?.nameRu ?? '',
    descriptionRo: values?.descriptionRo ?? '',
    descriptionRu: values?.descriptionRu ?? '',
    status: values?.status ?? CategoryStatus.ACTIVE
  };
}