import { TPermissionsInput } from "@/features/auth/lib/permissions.ts";
import { authClient } from "@/features/auth/lib/auth-client.ts";

type TPermissionConfig = Record<string, TPermissionsInput>;
type TPermissionResult<T extends TPermissionConfig> = { [K in keyof T]: boolean; };
type TRole = string | undefined | null;

export function hasPermissionForRole<T extends TPermissionConfig>(role: TRole, config: T,): TPermissionResult<T> {
  const result = {} as TPermissionResult<T>;

  if (!role) {
    for (const key in config)
      result[key] = false;

    return result;
  }

  for (const key in config) {
    result[key] = authClient.admin.checkRolePermission({
      permissions: config[key],
      // @ts-ignore
      role: role,
    });
  }

  return result;
}