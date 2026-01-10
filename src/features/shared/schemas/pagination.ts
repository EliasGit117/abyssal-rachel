import * as z from 'zod';

export const paginatedSchema = z.object({
  page: z.number().int().min(1).optional().catch(1),
  limit: z.number().int().min(1).max(100).optional().catch(10),
  dir: z.enum(['asc', 'desc']).optional(),
})

export type TPaginatedSchema = z.infer<typeof paginatedSchema>;
