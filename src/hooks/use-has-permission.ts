import { useSession } from "@/hooks/use-session.ts";
import { TPermissionsInput } from "@/lib/auth/permissions.ts";
import { hasPermissionForRole } from "@/lib/auth/has-permission-for-role.ts";

type TPermissionConfig = Record<string, TPermissionsInput>;
type TPermissionResult<T extends TPermissionConfig> = { [K in keyof T]: boolean; };


export function useHasPermission<T extends TPermissionConfig>(config: T,): TPermissionResult<T> {
  const { user } = useSession();
  return hasPermissionForRole(user?.role, config);
}