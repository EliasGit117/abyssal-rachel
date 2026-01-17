import { TCreateNotificationSchema } from '@/features/notifications/schemas/create-notification.ts';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { TNotificationBriefDto } from '@/features/notifications/dtos/notification-dto.ts';
import { orpc } from '@/lib/orpc/client.ts';


type TParams = TCreateNotificationSchema;
type TOptions = Omit<UseMutationOptions<TNotificationBriefDto, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useCreateNotificationMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values) => orpc.notifications.create.call(values),
    ...options,
    onSuccess: (data, variables,onMutateResult , context) => {
      void queryClient.invalidateQueries({ queryKey: orpc.notifications.list.key() });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};