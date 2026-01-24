import * as z from 'zod';
import { prisma } from '@/lib/db/prisma.ts';
import { Permission } from '@/lib/auth/permissions.ts';
import { authMiddleware } from '@/features/shared/orpc/middlewares/auth.ts';
import { auth, hasPermissionsForRole } from '@/lib/auth';
import { usersAdminPath, usersAdminBase } from '@/features/users/routes/admin/base.ts';


export const deleteUser = usersAdminBase
  .route({
    method: 'DELETE',
    path: `${usersAdminPath}/{id}`,
    summary: 'Delete user',
    description: 'Delete user by id'
  })
  .use(authMiddleware)
  .input(z.object({
    id: z.string().meta({
      example: 'Znvkk2jwZGvasLgmgAnXM1hQZnSaO6YC'
    })
  }))
  .errors({
    FORBIDDEN: { message: 'User does not have permission to delete users' },
    NOT_FOUND: { message: 'User not found' }
  })
  .handler(async ({ input: { id }, errors, context: { headers, user } }) => {
    const { canDelete } = hasPermissionsForRole(user.role, { canDelete: { user: [Permission.Delete] } });
    if (!canDelete)
      throw errors.FORBIDDEN();

    const foundUser = await prisma.user.findFirst({ where: { id: id } });
    if (!foundUser)
      throw errors.NOT_FOUND();

    await auth.api.removeUser({
      headers: headers,
      body: { userId: id }
    });
  });