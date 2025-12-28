import { createServerFn } from '@tanstack/react-start';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { prisma } from '@/lib/prisma.ts';
import { deleteNotificationByIdSchema } from '@/features/notifications/schemas/delete-notification-by-id.ts';
import { INotificationBriefDto } from '@/features/notifications/dtos/notification-dto.ts';


export const deleteNotificationByIdServerFn = createServerFn({ method: 'POST' })
  .inputValidator(deleteNotificationByIdSchema)
  .handler(async ({ data }) => {
    await prisma.notification.delete({ where: { id: data.id } });
  });


// React hook
type TParams = Parameters<typeof deleteNotificationByIdServerFn>[0]['data'];
type TContext = { previousNotifications?: INotificationBriefDto[]; };
type TOptions = Omit<UseMutationOptions<void, Error, TParams, TContext>, 'mutationFn'>;

export const useDeleteNotificationByIdMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, TParams, TContext>({
    mutationFn: (values) =>
      deleteNotificationByIdServerFn({ data: values }),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const previousNotifications =
        queryClient.getQueryData<INotificationBriefDto[]>([
          'notifications'
        ]);

      queryClient.setQueryData<INotificationBriefDto[]>(
        ['notifications'],
        (old) => old?.filter((notification) => notification.id !== variables.id) ?? []
      );

      return { previousNotifications };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ['notifications'],
          context.previousNotifications
        );
      }
    },

    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ['notifications']
      });
    },

    ...options
  });
};