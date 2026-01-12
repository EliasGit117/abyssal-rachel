import * as z from 'zod';
import { dateRangeSchema } from '@/components/data-table';
import { createServerFn } from '@tanstack/react-start';
import { queryOptions } from '@tanstack/react-query';
import { serverZodValidator } from '@/features/shared/utils/server-zod-validator.ts';
import { authMiddleware } from '@/middleware/auth.ts';
import { auth } from '@/features/auth/lib/auth.ts';
import { Permission } from '@/features/auth/lib/permissions.ts';
import { throwForbiddenError } from '@/features/shared/utils/throw-api-error.ts';
import { paginatedSchema } from '@/features/shared/schemas/pagination.ts';
import { Prisma, User } from '~/prisma/generated/prisma/client.ts';
import { prisma } from '@/lib/prisma.ts';
import { PaginationResultDtoFactory } from '@/features/shared/dtos/pagination-result-dto.ts';
import { UserBriefDtoFactory } from '@/features/auth/dtos/user-brief-dto.ts';


const sortableFields: (keyof User)[] = ['id', 'name', 'banned', 'email', 'emailVerified', 'role', 'createdAt', 'updatedAt'];

export const getUsersPaginatedAdminSchema = paginatedSchema.extend({
  id: z.string().optional().catch(undefined),
  sort: z.enum(sortableFields).optional().catch(undefined),
  name: z.string().optional().catch(undefined),
  email: z.string().optional().catch(undefined),
  emailVerified: z.boolean().optional().catch(undefined),
  banned: z.boolean().optional().catch(undefined),
  createdAt: dateRangeSchema.optional().catch(undefined),
  updatedAt: dateRangeSchema.optional().catch(undefined)
});

export type TGetUsersPaginatedAdmin = z.infer<typeof getUsersPaginatedAdminSchema>;


export const getUsersPaginatedAdminServerFn = createServerFn({ method: 'GET' })
  .inputValidator(serverZodValidator(getUsersPaginatedAdminSchema))
  .middleware([authMiddleware()])
  .handler(async ({ data, context: { user } }) => {
    const canList = await auth.api.userHasPermission({
      body: { userId: user!.id, permission: { user: [Permission.List] } }
    });

    if (!canList)
      throwForbiddenError({ translated: false });

    const where: Prisma.UserWhereInput = {};

    if (data.id != null)
      where.id = { contains: data.id, mode: 'insensitive' };

    if (data.name != null)
      where.name = { contains: data.name, mode: 'insensitive' };

    if (data.email != null)
      where.email = { contains: data.email, mode: 'insensitive' };

    if (data.emailVerified != null)
      where.emailVerified = data.emailVerified;

    if (data.banned != null)
      where.banned = data.banned;

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


    const [items, meta] = await prisma.user
      .paginate({ orderBy: { [data.sort ?? 'createdAt']: data.dir ?? 'desc' }, where: where })
      .withPages({
        includePageCount: true,
        limit: data.limit ?? 10,
        page: data.page ?? 1
      });

    return PaginationResultDtoFactory.getWithCount(UserBriefDtoFactory.fromEntities(items), meta);
  });


export function getUsersPaginatedAdminQueryOptions(params?: TGetUsersPaginatedAdmin) {

  return queryOptions({
    queryKey: ['admin', 'users', 'paginated', params],
    queryFn: () => getUsersPaginatedAdminServerFn({ data: params ?? {} })
  });
}