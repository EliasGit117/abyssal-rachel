import { createServerFn } from '@tanstack/react-start';
import { AdminCategoryDtoMapper, IAdminCategoryDto } from '@/features/categories/admin/dtos/admin-category-dto.ts';
import { queryOptions } from '@tanstack/react-query';
import { CategoryService } from '@/features/categories/admin/services/category-service.ts';
import { serverZodValidator } from '@/lib/zod/server-zod-validator.ts';
import { getCategoryByIdSchema } from '@/features/categories/admin/schemas/get-by-id.ts';



export const getCategoryByIdForAdminServerFn = createServerFn({ method: 'GET', })
  .inputValidator(serverZodValidator(getCategoryByIdSchema))
  .handler(async ({ data: { id } }): Promise<IAdminCategoryDto> => {
    const category = await CategoryService.getById(id)

    return AdminCategoryDtoMapper.fromEntity(category);
  });

export const getCategoryByIdForAdminQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: ['categories', id],
    queryFn: () => getCategoryByIdForAdminServerFn({ data: { id: id} })
  });
}