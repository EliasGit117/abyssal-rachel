import { User } from '~/prisma/generated/prisma/client.ts';
import { paginatedSchema } from '@/features/shared/schemas/pagination.ts';
import { dateRangeSchema } from '@/components/data-table';
import { paginationResultWithCountDtoSchema } from '@/features/shared/dtos/pagination-result-dto.ts';
import * as z from 'zod';
import { userBriefDtoSchema } from '@/features/users/dtos/user-brief-dto.ts';


const sortableFields: (keyof User)[] = [
  'id',
  'name',
  'banned',
  'email',
  'emailVerified',
  'role',
  'createdAt',
  'updatedAt'
];

export const listUsersSchema = paginatedSchema.extend({
  id: z.string().optional().catch(undefined),
  sort: z.enum(sortableFields).optional().catch(undefined),
  name: z.string().optional().catch(undefined),
  email: z.string().optional().catch(undefined),
  emailVerified: z.boolean().optional().catch(undefined),
  banned: z.boolean().optional().catch(undefined),
  createdAt: dateRangeSchema.optional().catch(undefined),
  updatedAt: dateRangeSchema.optional().catch(undefined)
});

export type TListUsers = z.infer<typeof listUsersSchema>;
export const paginatedUsersSchema = paginationResultWithCountDtoSchema(userBriefDtoSchema);
