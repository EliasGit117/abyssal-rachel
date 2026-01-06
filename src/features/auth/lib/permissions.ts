import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';



export enum Permission {
  List = 'list',
  Get = 'get',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

const { List, Get, Create, Update, Delete } = Permission;
const AllPermissions = [List, Get, Create, Update, Delete];


const statement = {
  ...defaultStatements,
  users: AllPermissions,
  notifications: AllPermissions,
  banners: AllPermissions,
  categories: AllPermissions
} as const;

export const accessControl = createAccessControl(statement);

export const user = accessControl.newRole({
  notifications: [List, Get],
  banners: [List]
});

export const admin = accessControl.newRole({
  notifications: AllPermissions,
  categories: AllPermissions,
  banners: AllPermissions,
  ...adminAc.statements
});