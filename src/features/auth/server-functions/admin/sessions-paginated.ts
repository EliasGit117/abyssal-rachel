import * as z from 'zod';
import { createServerFn } from '@tanstack/react-start';
import { queryOptions } from '@tanstack/react-query';
import { Prisma, Session } from '~/prisma/generated/prisma/client.ts';
import { prisma } from '@/lib/prisma.ts';
import { paginatedSchema } from '@/features/shared/schemas/pagination.ts';
import { serverZodValidator } from '@/features/shared/utils/server-zod-validator.ts';
import { authMiddleware } from '@/middleware/auth.ts';
import { auth } from '@/features/auth/lib/auth.ts';
import { Permission } from '@/features/auth/lib/permissions.ts';
import { throwForbiddenError } from '@/features/shared/utils/throw-api-error.ts';
import { PaginationResultDtoFactory } from '@/features/shared/dtos/pagination-result-dto.ts';
import { dateRangeSchema } from '@/components/data-table';
import { SessionBriefDtoFactory } from '@/features/auth/dtos/session-brief-dto.ts';

const sortableFields: (keyof Session)[] = [
  'id',
  'ipAddress',
  'createdAt',
  'updatedAt',
  'expiresAt',
  'userId'
];

export const getSessionsPaginatedAdminSchema = paginatedSchema.extend({
  sort: z.enum(sortableFields).optional().catch(undefined),
  userId: z.string().optional().catch(undefined),
  ipAddress: z.string().optional().catch(undefined),
  createdAt: dateRangeSchema.optional().catch(undefined),
  updatedAt: dateRangeSchema.optional().catch(undefined),
  expiresAt: dateRangeSchema.optional().catch(undefined)
});

export type TGetSessionsPaginatedAdmin = z.infer<typeof getSessionsPaginatedAdminSchema>;

export const getSessionsPaginatedAdminServerFn = createServerFn({
  method: 'GET'
})
  .inputValidator(serverZodValidator(getSessionsPaginatedAdminSchema))
  .middleware([authMiddleware()])
  .handler(async ({ data, context: { user, session } }) => {
    const canList = await auth.api.userHasPermission({
      body: { userId: user!.id, permission: { session: [Permission.List] } }
    });

    if (!canList)
      throwForbiddenError({ translated: false });

    const where: Prisma.SessionWhereInput = {};

    if (data.userId != null) where.userId = data.userId;
    if (data.ipAddress != null)
      where.ipAddress = {
        contains: data.ipAddress,
        mode: 'insensitive'
      };

    if (data.createdAt?.from != null || data.createdAt?.to != null) {
      where.createdAt = {};

      if (data.createdAt.from != null)
        where.createdAt.gte = data.createdAt.from;

      if (data.createdAt.to != null)
        where.createdAt.lte = data.createdAt.to;
    }

    if (data.updatedAt?.from != null || data.updatedAt?.to != null) {
      where.updatedAt = {};

      if (data.updatedAt.from != null)
        where.updatedAt.gte = data.updatedAt.from;

      if (data.updatedAt.to != null)
        where.updatedAt.lte = data.updatedAt.to;
    }

    if (data.expiresAt?.from != null || data.expiresAt?.to != null) {
      where.expiresAt = {};

      if (data.expiresAt.from != null)
        where.expiresAt.gte = data.expiresAt.from;

      if (data.expiresAt.to != null)
        where.expiresAt.lte = data.expiresAt.to;
    }

    const [items, meta] = await prisma.session
      .paginate({
        where: where,
        orderBy: { [data.sort ?? 'createdAt']: data.dir ?? 'desc' }
      })
      .withPages({
        page: data.page ?? 1,
        limit: data.limit ?? 10,
        includePageCount: true
      });

    return PaginationResultDtoFactory.getWithCount(SessionBriefDtoFactory.fromEntities(items, {
      currentSessionId: session!.id,
      currentUserId: user!.id
    }), meta);
  });

export function getSessionsPaginatedAdminQueryOptions(params?: TGetSessionsPaginatedAdmin) {

  return queryOptions({
    queryKey: ['admin', 'sessions', 'paginated', params],
    queryFn: () => getSessionsPaginatedAdminServerFn({ data: params ?? {} })
  });
}