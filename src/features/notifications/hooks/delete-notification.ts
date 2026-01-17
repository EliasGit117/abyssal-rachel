import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc/client.ts';
import { TNotificationBriefDto } from '@/features/notifications/dtos/notification-dto.ts';
import { TOrpcInputs, TOrpcOutputs } from '@/features/shared/orpc/router.ts';

type TParams = TOrpcInputs['admin']['notifications']['delete'];
type TData = TOrpcOutputs['admin']['notifications']['delete'];
type TContext = { previousNotifications?: TNotificationBriefDto[] };
type TOptions = Omit<UseMutationOptions<TData, Error, TParams, TContext>, 'mutationFn'>;



export const useDeleteNotification = (options?: TOptions) => {
  const queryClient = useQueryClient();

  const listQueryOptions = orpc.notifications.list.queryOptions();
  const listKey = listQueryOptions.queryKey;

  return useMutation<TData, Error, TParams, TContext>({
    mutationFn: (values) => orpc.admin.notifications.delete.call(values),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: listKey });

      const previousNotifications =
        queryClient.getQueryData<TNotificationBriefDto[]>(listKey);

      queryClient.setQueryData<TNotificationBriefDto[]>(listKey,
        (old) => old?.filter((n) => n.id !== variables.id) ?? [],
      );

      return { previousNotifications };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(listKey, context.previousNotifications);
      }
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: listKey });
    },

    ...options,
  });
};