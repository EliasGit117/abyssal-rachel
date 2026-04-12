import * as z from 'zod';

export const paginatedSchema = z.object({
  page: z.number().int().min(1).optional().catch(1).meta({ example: 1, }),
  limit: z.number().int().min(1).max(100).optional().catch(10).meta({
    example: 10,
    examples: [10, 25, 50, 100]
  }),
  dir: z.enum(['asc', 'desc']).optional().meta({
    example: 'desc',
    examples: ['asc', 'desc']
  }),
})

export type TPaginatedSchema = z.infer<typeof paginatedSchema>;
