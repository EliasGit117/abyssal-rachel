import { createServerFn } from '@tanstack/react-start';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient
} from '@tanstack/react-query';
import { authMiddleware } from '@/middleware/auth.ts';
import { serverZodValidator } from '@/lib/zod/server-zod-validator.ts';
import { createCategorySchema } from '@/features/categories/admin/schemas/create.ts';
import { CategoryService } from '@/features/categories/admin/services/category-service.ts';
import { auth } from '@/lib/auth/auth.ts';
import { Permission } from '@/lib/auth/permissions.ts';
import {
  throwForbiddenError,
  throwUnauthorizedError
} from '@/lib/errors/throw-api-error.ts';
import { getSessionServerFn } from '@/features/auth/server-functions/public/get-session.ts';


export const createCategoryServerFn = createServerFn({ method: 'POST' })
  .inputValidator(serverZodValidator(createCategorySchema))
  .middleware([authMiddleware()])
  .handler(async ({ data }) => {
    const session = await getSessionServerFn();

    if (!session)
      throwUnauthorizedError({ translated: false });

    const canCreate = await auth.api.userHasPermission({
      body: {
        userId: session.user!.id,
        permission: { category: [Permission.Create] }
      }
    });

    if (!canCreate.success)
      throwForbiddenError({ translated: false });

    return CategoryService.create(data);
  });



type TParams = Parameters<typeof createCategoryServerFn>[0]['data'];
type TOptions = Omit<UseMutationOptions<Awaited<ReturnType<typeof createCategoryServerFn>>, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useCreateCategoryMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values) =>
      createCategoryServerFn({ data: values }),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'categories' });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};