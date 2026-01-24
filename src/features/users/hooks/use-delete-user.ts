import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { TOrpcInputs, TOrpcOutputs } from '@/features/shared/orpc/router.ts';
import { orpc } from '@/lib/orpc';
import { useConfirm } from '@/components/ui/confirm-dialog.tsx';
import { toast } from 'sonner';


type TParams = TOrpcInputs['admin']['users']['delete'];
type TData = TOrpcOutputs['admin']['users']['delete'];
type TOptions = Omit<UseMutationOptions<TData, Error, TParams>, 'mutationFn' | 'onMutate'> & {
  withConfirmation?: boolean;
  withToastProgression?: boolean;
};


export const useDeleteUserMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const {
    withConfirmation = true,
    withToastProgression = true,
    ...mutationOptions
  } = options ?? {};

  return useMutation({
    ...mutationOptions,
    mutationFn: async (params: TParams) => {

      if (options?.withConfirmation ?? true) {
        const isConfirmed = await confirm({
          title: 'Delete user',
          description: 'Are you sure you want to delete user?',
          confirmText: 'Delete',
          cancelText: 'Cancel',
          alertDialogTitle: { className: 'flex items-center gap-2' },
          cancelButton: { variant: 'outline' },
          confirmButton: { variant: 'destructive' }
        });

        if (!isConfirmed)
          return;
      }

      const promise = orpc.admin.users.delete.call(params);

      if (options?.withToastProgression ?? true) {
        toast.promise(promise, {
          loading: 'Deleting user...',
          success: 'User deleted successfully',
          error: (err) => err.message ?? 'Failed to delete user.',
        });
      }

      return await promise;
    },
    onSuccess: (data, variables, onMutateResult,  context) => {
      void queryClient.invalidateQueries({ queryKey: orpc.admin.users.list.key(), });
      void queryClient.invalidateQueries({ queryKey: orpc.sessions.current.queryKey() });

      mutationOptions.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
