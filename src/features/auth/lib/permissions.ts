import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';



export enum Permission {
  List = 'list',
  View = 'view',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

const { List, View, Create, Update, Delete } = Permission;
const AllPermissions = [List, View, Create, Update, Delete];


const statement = {
  ...defaultStatements,
  users: AllPermissions,
  notifications: AllPermissions,
  banners: AllPermissions,
  categories: AllPermissions
} as const;

export const accessControl = createAccessControl(statement);

export const user = accessControl.newRole({
  notifications: [List, View],
  banners: [List]
});

export const admin = accessControl.newRole({
  notifications: AllPermissions,
  categories: AllPermissions,
  banners: AllPermissions,
  ...adminAc.statements
});