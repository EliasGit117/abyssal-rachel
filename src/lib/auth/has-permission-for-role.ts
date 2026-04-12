import { TPermissionsInput } from "@/lib/auth/permissions.ts";
import { authClient } from "@/lib/auth/auth-client.ts";

type TRole = string | undefined | null;
type TPermissionConfig = Record<string, TPermissionsInput>;
type TPermissionResult<T extends TPermissionConfig> = { [K in keyof T]: boolean; };


export function hasPermissionForRole(role: TRole, permissions: TPermissionsInput): boolean {
  if (!role)
    return false;

  return authClient.admin.checkRolePermission({
    permissions,
    // @ts-ignore
    role,
  });
}


export function hasPermissionsForRole<T extends TPermissionConfig>(role: TRole, config: T): TPermissionResult<T> {
  const result = {} as TPermissionResult<T>;
  for (const key in config)
    result[key] = hasPermissionForRole(role, config[key]);

  return result;
}