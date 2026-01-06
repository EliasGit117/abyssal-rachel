import { categoryIdSchema } from '@/features/categories/schemas/base.ts';
import * as z from 'zod';


export const deleteCategorySchema = z.object({
  categoryId: categoryIdSchema,
});

export type TDeleteCategory = z.infer<typeof deleteCategorySchema>;