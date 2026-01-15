import * as z from 'zod';
import { createServerFn } from '@tanstack/react-start';
import { serverZodValidator } from '@/lib/zod/server-zod-validator.ts';
import { authMiddleware } from '@/middleware/auth.ts';
import { auth } from '@/lib/auth/auth.ts';
import { Permission } from '@/lib/auth/permissions.ts';
import { throwForbiddenError } from '@/lib/errors/throw-api-error.ts';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { getSessionQueryOptions } from '@/features/auth/server-functions/public/get-session.ts';
import { toast } from 'sonner';
import { useConfirm } from '@/components/ui/confirm-dialog.tsx';
import { IconTrash } from '@tabler/icons-react';


export const deleteUserSchema = z.object({
  id: z.string()
});

export type TDeleteUser = z.infer<typeof deleteUserSchema>;

export const deleteUserServerFn = createServerFn({ method: 'POST' })
  .inputValidator(serverZodValidator(deleteUserSchema))
  .middleware([authMiddleware()])
  .handler(async ({ data, context: { user, headers } }) => {
    const canDelete = await auth.api.userHasPermission({
      body: { userId: user!.id, permission: { user: [Permission.Delete] } }
    });

    if (!canDelete)
      throwForbiddenError({ translated: false });

    await auth.api.removeUser({
      headers: headers,
      body: { userId: data.id }
    });
  });


type TParams = Parameters<typeof deleteUserServerFn>[0];
type TOptions = Omit<UseMutationOptions<void, Error, TParams>, 'mutationFn' | 'onMutate'> & {
  withConfirmation?: boolean;
  withToastProgression?: boolean;
};

export const useDeleteUserMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  return useMutation({
    mutationFn: async (params) => {

      if (options?.withConfirmation ?? true) {
        const isConfirmed = await confirm({
          title: 'Delete user',
          description: 'Are you sure you want to delete user?',
          confirmText: 'Delete',
          cancelText: 'Cancel',
          icon: <IconTrash className='size-5 text-destructive'/>,
          alertDialogTitle: { className: 'flex items-center gap-2' },
          cancelButton: { variant: 'outline' },
          confirmButton: { variant: 'destructive' }
        });

        if (!isConfirmed)
          return;
      }

      const promise = deleteUserServerFn(params);

      if (options?.withToastProgression ?? true) {
        toast.promise(promise, {
          loading: 'Deleting user...',
          success: 'User deleted successfully',
          error: (err) => err.message ?? 'Failed to delete user.',
        });
      }

      return await promise;
    },
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'admin' && query.queryKey[1] === 'users' });
      void queryClient.invalidateQueries({ queryKey: getSessionQueryOptions().queryKey });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};

