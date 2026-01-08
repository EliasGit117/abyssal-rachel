import { categoryIdSchema } from '@/features/categories/admin/schemas/base.ts';
import * as z from 'zod';


export const getCategoryByIdSchema = z.object({
  id: categoryIdSchema,
});
