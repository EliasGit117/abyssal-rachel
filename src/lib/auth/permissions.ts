import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access';

// permissions
export enum Permission {
  List = 'list',
  Get = 'get',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

const { List, Get, Create, Update, Delete } = Permission;
const AllPermissions = [List, Get, Create, Update, Delete];

// Access statements
const statement = {
  ...defaultStatements,
  notification: AllPermissions,
  banner: AllPermissions,
  category: AllPermissions
} as const;

// Cccess types
export type TAccessStatement = typeof statement;
export type TAccessCategory = keyof TAccessStatement;
export type TAccessPermission<C extends TAccessCategory> =
  TAccessStatement[C][number];
export type TPermissionsInput = {
  [C in TAccessCategory]?: TAccessPermission<C>[];
};

// Access control
export const accessControl = createAccessControl(statement);

// Roles
export const user = accessControl.newRole({
  notification: [List, Get],
  banner: [List]
});

export const admin = accessControl.newRole({
  notification: AllPermissions,
  category: AllPermissions,
  banner: AllPermissions,
  ...adminAc.statements
});

export const manager = accessControl.newRole({
  notification: [List, Get],
  category: [List, Get],
  banner: [List, Get],
  session: [List],
  user: [List, Get]
});

// Role helpers
export const roles = { admin, user, manager };

const roleWithAccessToAdmin: string[] = ['admin', 'manager'] satisfies (keyof typeof roles)[];

export const hasRoleAccessToAdmin = (role: string | undefined | null): boolean => {
  if (role == null)
    return false;

  return roleWithAccessToAdmin.includes(role);
};