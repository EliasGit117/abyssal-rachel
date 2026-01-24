import { Prisma } from '~/prisma/generated/prisma/client.ts';
import { prisma } from '@/lib/db/prisma.ts';
import { auth } from '@/lib/auth/auth.ts';
import { Permission } from '@/lib/auth/permissions.ts';
import { throwForbiddenError } from '@/lib/errors/throw-api-error.ts';
import { PaginationResultDtoFactory } from '@/features/shared/dtos/pagination-result-dto.ts';
import { listSessionsSchema, paginatedSessionSchema } from '@/features/sessions/dtos/list-sessions-dto.ts';
import { authMiddleware } from '@/features/shared/orpc/middlewares/auth.ts';
import { SessionDtoFactory } from '@/features/sessions/dtos/session-dto.ts';
import { sessionsAdminBase } from '@/features/sessions/routes/admin/base.ts';



export const listSessions = sessionsAdminBase
  .route({
    method: 'GET',
    summary: 'List sessions',
    description: 'Paginated session list with filters'
  })
  .use(authMiddleware)
  .input(listSessionsSchema)
  .output(paginatedSessionSchema)
  .handler(async ({ input, context: { user, session } }) => {
    const canList = await auth.api.userHasPermission({
      body: { userId: user.id, permission: { session: [Permission.List] } }
    });

    if (!canList)
      throwForbiddenError({ translated: false });

    const where: Prisma.SessionWhereInput = {};

    if (input.userId != null) where.userId = input.userId;
    if (input.ipAddress != null)
      where.ipAddress = {
        contains: input.ipAddress,
        mode: 'insensitive'
      };

    if (input.createdAt?.from != null || input.createdAt?.to != null) {
      where.createdAt = {};

      if (input.createdAt.from != null)
        where.createdAt.gte = input.createdAt.from;

      if (input.createdAt.to != null)
        where.createdAt.lte = input.createdAt.to;
    }

    if (input.updatedAt?.from != null || input.updatedAt?.to != null) {
      where.updatedAt = {};

      if (input.updatedAt.from != null)
        where.updatedAt.gte = input.updatedAt.from;

      if (input.updatedAt.to != null)
        where.updatedAt.lte = input.updatedAt.to;
    }

    if (input.expiresAt?.from != null || input.expiresAt?.to != null) {
      where.expiresAt = {};

      if (input.expiresAt.from != null)
        where.expiresAt.gte = input.expiresAt.from;

      if (input.expiresAt.to != null)
        where.expiresAt.lte = input.expiresAt.to;
    }

    const [items, meta] = await prisma.session
      .paginate({
        where: where,
        orderBy: { [input.sort ?? 'createdAt']: input.dir ?? 'desc' }
      })
      .withPages({
        page: input.page ?? 1,
        limit: input.limit ?? 10,
        includePageCount: true
      });

    return PaginationResultDtoFactory.getWithCount(SessionDtoFactory.fromEntities(items, {
      currentSessionId: session.id,
      currentUserId: user!.id
    }), meta);
  });
