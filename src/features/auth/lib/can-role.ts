import { authClient } from '@/features/auth/lib/auth-client.ts';

type TCheckRolePermissionParams = Parameters<typeof authClient.admin.checkRolePermission>[0];

type TRoleCanParams = { role?: string | null; } & Omit<TCheckRolePermissionParams, 'role'>;

export function canRole({ role, ...params }: TRoleCanParams) {
  return authClient.admin.checkRolePermission({
    // @ts-ignore
    role: role ?? '',
    ...params,
  });
}