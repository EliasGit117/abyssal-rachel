import { Prisma } from '~/prisma/generated/prisma/client.ts';
import { prisma } from '@/lib/db/prisma.ts';
import { Permission } from '@/lib/auth/permissions.ts';
import { throwForbiddenError } from '@/lib/errors/throw-api-error.ts';
import { PaginationResultDtoFactory } from '@/features/shared/dtos/pagination-result-dto.ts';
import { usersAdminBase } from '@/features/users/routes/admin/base.ts';
import { authMiddleware } from '@/features/shared/orpc/middlewares/auth.ts';
import { hasPermissionForRole } from '@/lib/auth';
import { listUsersSchema, paginatedUsersSchema } from '@/features/users/dtos/list-users-dto.ts';
import { UserBriefDtoFactory } from '@/features/users/dtos/user-brief-dto.ts';



export const listUsers = usersAdminBase
  .route({
    method: 'POST',
    summary: 'List users',
    description: 'Paginated user list with filters'
  })
  .use(authMiddleware)
  .input(listUsersSchema)
  .output(paginatedUsersSchema)
  .handler(async ({ input, context }) => {
    const user = context.user!;
    const canList = hasPermissionForRole(user?.role, { user: [Permission.List] });

    if (!canList)
      throwForbiddenError({ translated: false });

    const where: Prisma.UserWhereInput = {};

    if (input.id != null)
      where.id = { contains: input.id, mode: 'insensitive' };

    if (input.name != null)
      where.name = { contains: input.name, mode: 'insensitive' };

    if (input.email != null)
      where.email = { contains: input.email, mode: 'insensitive' };

    if (input.emailVerified != null)
      where.emailVerified = input.emailVerified;

    if (input.banned != null)
      where.banned = input.banned;

    if (input.createdAt?.from || input.createdAt?.to) {
      where.createdAt = {};

      if (input.createdAt.from)
        where.createdAt.gte = input.createdAt.from;

      if (input.createdAt.to)
        where.createdAt.lte = input.createdAt.to;
    }

    if (input.updatedAt?.from || input.updatedAt?.to) {
      where.updatedAt = {};

      if (input.updatedAt.from)
        where.updatedAt.gte = input.updatedAt.from;

      if (input.updatedAt.to)
        where.updatedAt.lte = input.updatedAt.to;
    }

    const [items, meta] = await prisma.user
      .paginate({
        where,
        orderBy: {
          [input.sort ?? 'createdAt']: input.dir ?? 'desc'
        }
      })
      .withPages({
        limit: input.limit ?? 10,
        page: input.page ?? 1,
        includePageCount: true
      });

    return PaginationResultDtoFactory.getWithCount(
      UserBriefDtoFactory.fromEntities(items),
      meta
    );
  });