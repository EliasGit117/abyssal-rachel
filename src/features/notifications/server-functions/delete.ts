import { createServerFn } from '@tanstack/react-start';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import * as z from "zod";
import { prisma } from '@/lib/prisma.ts';

export const deleteNotificationByIdSchema = z.object({ id: z.number() });

export const deleteNotificationByIdServerFn = createServerFn({ method: 'POST' })
  .inputValidator(deleteNotificationByIdSchema)
  .handler(async ({ data }) => {
    await prisma.notification.delete({ where: { id: data.id } });
  });


// React hook
type TParams = Parameters<typeof deleteNotificationByIdServerFn>[0]['data'];
type TOptions = Omit<UseMutationOptions<void, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useDeleteNotificationByIdMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values) => deleteNotificationByIdServerFn({ data: values }),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'notifications' });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};
