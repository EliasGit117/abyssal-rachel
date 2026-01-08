import { categorySchema } from './base.ts';
import * as z from 'zod';

export const createCategorySchema = categorySchema.omit({
  id: true,
});

export type TCreateCategory = z.infer<typeof createCategorySchema>;