import * as z from "zod";
import { CategoryStatus } from '~/prisma/generated/prisma/enums.ts';


export const categoryIdSchema = z.number().int();
export const slugSchema = z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

export const categorySchema = z.object({
  id: categoryIdSchema,
  slug: slugSchema,
  nameRo: z.string().min(1),
  nameRu: z.string().min(1),
  descriptionRo: z.string().optional().nullable(),
  descriptionRu: z.string().optional().nullable(),
  parentId: categoryIdSchema.optional().nullable(),
  status: z.enum(CategoryStatus)
});

export type TCategory = z.infer<typeof categorySchema>;