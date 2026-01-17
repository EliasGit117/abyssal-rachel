import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc/client.ts';
import { TOrpcInputs, TOrpcOutputs } from '@/features/shared/orpc/router.ts';


type TParams = TOrpcInputs['admin']['notifications']['create'];
type TData = TOrpcOutputs['admin']['notifications']['create'];

type TOptions = Omit<UseMutationOptions<TData, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useCreateNotificationMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values) => orpc.admin.notifications.create.call(values),
    ...options,
    onSuccess: (data, variables,onMutateResult , context) => {
      void queryClient.invalidateQueries({ queryKey: orpc.notifications.list.key() });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};