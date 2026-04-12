import { z } from 'zod';

export const dateRangeSchema = z
  .object({
    from: z.union([z.date(), z.iso.datetime().transform(val => new Date(val))]).optional().meta({
      description: 'Start date (ISO 8601)',
      format: 'date-time',
      examples: ['2026-02-01T00:00:00.000Z']
    }),

    to: z.union([z.date(), z.iso.datetime().transform(val => new Date(val))]).optional().meta({
      description: 'End date (ISO 8601)',
      format: 'date-time',
      examples: ['2026-02-28T23:59:59.999Z']
    })
  }).meta({
    description: 'Date range filter',
    examples: [{ from: '2026-02-01T00:00:00.000Z', to: '2026-02-28T23:59:59.999Z' }]
  });

export type TDateRange = z.infer<typeof dateRangeSchema>;

export const numberRangeSchema = z
  .tuple([z.number().nullable(), z.number().nullable()])
  .refine(([from, to]) => from !== null || to !== null, {
    message: 'At least one of \'from\' or \'to\' must be defined'
  })
  .refine(([from, to]) => {
    if (from !== null && to !== null) {
      return from <= to;
    }
    return true;
  }, {
    message: '\'from\' must be less than or equal to \'to\''
  });

export type TNumberRange = z.infer<typeof numberRangeSchema>;