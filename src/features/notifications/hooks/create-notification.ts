import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc/client.ts';
import { TOrpcInputs, TOrpcOutputs } from '@/features/shared/orpc/router.ts';


type TParams = TOrpcInputs['notifications']['create'];
type TData = TOrpcOutputs['notifications']['create'];

type TOptions = Omit<UseMutationOptions<TData, Error, TParams>, 'mutationFn' | 'onMutate'>;

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