import { useSession } from "@/hooks/use-session.ts";
import { TPermissionsInput } from "@/features/auth/lib/permissions.ts";
import { hasPermissionForRole } from "@/features/auth/lib/has-permission-for-role.ts";

type TPermissionConfig = Record<string, TPermissionsInput>;
type TPermissionResult<T extends TPermissionConfig> = { [K in keyof T]: boolean; };


export function useHasPermission<T extends TPermissionConfig>(config: T,): TPermissionResult<T> {
  const { user } = useSession();
  return hasPermissionForRole(user?.role, config);
}