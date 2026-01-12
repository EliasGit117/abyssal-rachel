import * as z from 'zod';
import { createServerFn } from '@tanstack/react-start';
import { serverZodValidator } from '@/features/shared/utils/server-zod-validator.ts';
import { authMiddleware } from '@/middleware/auth.ts';
import { auth } from '@/features/auth/lib/auth.ts';
import { Permission } from '@/features/auth/lib/permissions.ts';
import {
  throwBadRequest,
  throwForbiddenError
} from '@/features/shared/utils/throw-api-error.ts';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient
} from '@tanstack/react-query';
import { getSessionQueryOptions } from '@/features/auth/server-functions/public/get-session.ts';
import { toast } from 'sonner';
import { useConfirm } from '@/components/ui/confirm-dialog.tsx';
import { prisma } from '@/lib/prisma.ts';
import { useSession } from '@/hooks/use-session.ts';

export const revokeSessionsSchema = z.object({
  ids: z.array(z.string()).min(1)
});
export type TRevokeSessions = z.infer<typeof revokeSessionsSchema>;

export const revokeSessionsServerFn = createServerFn({ method: 'POST' })
  .inputValidator(serverZodValidator(revokeSessionsSchema))
  .middleware([authMiddleware()])
  .handler(
    async ({ data, context: { user, headers, session: sessionFromReq } }) => {
      const canRevoke = await auth.api.userHasPermission({
        body: { userId: user!.id, permission: { session: [Permission.List, Permission.Delete] } }
      });

      if (!canRevoke)
        throwForbiddenError({ translated: false });

      const sessions = await prisma.session.findMany({ where: { id: { in: data.ids } } });

      if (sessions.length === 0) throwBadRequest({ translated: false });

      const currentSessionIncluded = sessions.some(
        (s) => s.id === sessionFromReq?.id
      );

      // Revoke all sessions
      for (const session of sessions) {
        if (session.id === sessionFromReq?.id) continue;
        await auth.api.revokeSession({
          headers: headers,
          body: { token: session.token }
        });
      }

      // Sign out current session last if included
      if (currentSessionIncluded)
        await auth.api.signOut({ headers: headers });

      return { revokedCount: sessions.length };
    }
  );

type TParams = { ids: string[] };
type TOptions = Omit<
  UseMutationOptions<{ revokedCount: number }, Error, TParams>,
  'mutationFn' | 'onMutate'
> & {
  withConfirmation?: boolean;
  withToastProgression?: boolean;
};

export const useRevokeSessionsMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const { session } = useSession();

  return useMutation({
    mutationFn: async (params) => {
      if (options?.withConfirmation ?? true) {
        const count = params.ids.length;
        const isCurrentIncluded = params.ids.includes(session?.id ?? '');

        const isConfirmed = await confirm({
          title: `Revoke ${count} session${count > 1 ? 's' : ''}`,
          description: isCurrentIncluded
            ? `Are you sure you want to revoke ${count} session${count > 1 ? 's' : ''}? This includes your current session and you will be signed out.`
            : `Are you sure you want to revoke ${count} session${count > 1 ? 's' : ''}?`,
          confirmText: 'Revoke',
          cancelText: 'Cancel'
        });

        if (!isConfirmed) return { revokedCount: 0 };
      }

      const promise = revokeSessionsServerFn({ data: { ids: params.ids } });

      if (options?.withToastProgression ?? true) {
        const count = params.ids.length;
        toast.promise(promise, {
          loading: `Revoking ${count} session${count > 1 ? 's' : ''}...`,
          success: (data) =>
            `${data.revokedCount} session${data.revokedCount > 1 ? 's' : ''} revoked successfully`,
          error: (err) =>
            err.message ?? `Failed to revoke session${count > 1 ? 's' : ''}.`
        });
      }

      return await promise;
    },
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'admin' && query.queryKey[1] === 'sessions'
      });

      if (variables.ids.includes(session?.id ?? ''))
        void queryClient.invalidateQueries({
          queryKey: getSessionQueryOptions().queryKey
        });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};