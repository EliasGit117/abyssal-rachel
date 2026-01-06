import { createServerFn } from '@tanstack/react-start';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient
} from '@tanstack/react-query';
import { requireAuth } from '@/middleware/require-auth.ts';
import { serverZodValidator } from '@/features/shared/utils/server-zod-validator.ts';
import { createCategorySchema } from '@/features/categories/schemas/create.ts';
import { CategoryService } from '@/features/categories/services/category-service.ts';
import { auth } from '@/features/auth/lib/auth.ts';
import { Permission } from '@/features/auth/lib/permissions.ts';
import {
  throwForbiddenError,
  throwUnauthorizedError
} from '@/features/shared/utils/throw-api-error.ts';
import { getSessionServerFn } from '@/features/auth/server-functions/get-session.ts';


export const createCategoryServerFn = createServerFn({ method: 'POST' })
  .inputValidator(serverZodValidator(createCategorySchema))
  .middleware([requireAuth()])
  .handler(async ({ data }) => {
    const session = await getSessionServerFn();

    if (!session)
      throwUnauthorizedError();

    const canCreate = await auth.api.userHasPermission({
      body: {
        userId: session.user!.id,
        permission: { categories: [Permission.Create] }
      }
    });

    if (!canCreate.success)
      throwForbiddenError();

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