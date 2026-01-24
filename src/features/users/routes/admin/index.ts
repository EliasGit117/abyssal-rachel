import { deleteUser } from '@/features/users/routes/admin/delete.ts';
import { listUsers } from '@/features/users/routes/admin/list.ts';


export const usersAdminRoutes = {
  list: listUsers,
  delete: deleteUser
};