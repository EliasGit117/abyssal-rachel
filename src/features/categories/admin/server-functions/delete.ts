import { createServerFn } from '@tanstack/react-start';
import { authMiddleware } from '@/middleware/auth.ts';
import { serverZodValidator } from '@/lib/zod/server-zod-validator.ts';
import { deleteCategorySchema } from '@/features/categories/admin/schemas/delete.ts';
import { CategoryService } from '@/features/categories/admin/services/category-service.ts';
import { auth } from '@/lib/auth/auth.ts';
import { Permission } from '@/lib/auth/permissions.ts';
import {
  throwForbiddenError,
  throwUnauthorizedError
} from '@/lib/errors/throw-api-error.ts';
import { getSessionServerFn } from '@/features/auth/server-functions/public/get-session.ts';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';


export const deleteCategoryServerFn = createServerFn({ method: 'POST' })
  .inputValidator(serverZodValidator(deleteCategorySchema))
  .middleware([authMiddleware()])
  .handler(async ({ data }) => {
    const session = await getSessionServerFn();

    if (!session)
      throwUnauthorizedError({ translated: false });

    const canDelete = await auth.api.userHasPermission({
      body: {
        userId: session.user!.id,
        permission: { category: [Permission.Delete] }
      }
    });

    if (!canDelete.success)
      throwForbiddenError({ translated: false });

    return CategoryService.delete({ categoryId: data.categoryId });
  });


type TParams = Parameters<typeof deleteCategoryServerFn>[0]['data'];
type TResult = Awaited<ReturnType<typeof deleteCategoryServerFn>>;

type TOptions = Omit<UseMutationOptions<TResult, Error, TParams>, 'mutationFn'>;

export const useDeleteCategoryMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values) => deleteCategoryServerFn({ data: values }),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'categories' });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};