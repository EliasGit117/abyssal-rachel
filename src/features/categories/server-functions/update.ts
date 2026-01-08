import { createServerFn } from '@tanstack/react-start';
import { requireAuth } from '@/middleware/require-auth.ts';
import { serverZodValidator } from '@/features/shared/utils/server-zod-validator.ts';
import { updateCategorySchema } from '@/features/categories/schemas/update.ts';
import { CategoryService } from '@/features/categories/services/category-service.ts';
import { auth } from '@/features/auth/lib/auth.ts';
import { Permission } from '@/features/auth/lib/permissions.ts';
import {
  throwForbiddenError,
  throwUnauthorizedError
} from '@/features/shared/utils/throw-api-error.ts';
import { getSessionServerFn } from '@/features/auth/server-functions/get-session.ts';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';


export const updateCategoryServerFn = createServerFn({ method: 'POST' })
  .inputValidator(serverZodValidator(updateCategorySchema))
  .middleware([requireAuth()])
  .handler(async ({ data }) => {
    const session = await getSessionServerFn();

    if (!session)
      throwUnauthorizedError({ translated: false });

    const canUpdate = await auth.api.userHasPermission({
      body: {
        userId: session.user!.id,
        permission: { categories: [Permission.Update] }
      }
    });

    if (!canUpdate.success)
      throwForbiddenError({ translated: false });


    return CategoryService.update(data);
  });


type TParams = Parameters<typeof updateCategoryServerFn>[0]['data'];
type TOptions = Omit<UseMutationOptions<Awaited<ReturnType<typeof updateCategoryServerFn>>, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useUpdateCategoryMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values) => updateCategoryServerFn({ data: values }),
    ...options,

    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'categories' });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};