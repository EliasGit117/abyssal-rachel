import { categorySchema } from './base.ts';
import * as z from 'zod';


export const updateCategorySchema = categorySchema.extend({});

export type TUpdateCategory = z.infer<typeof updateCategorySchema>;