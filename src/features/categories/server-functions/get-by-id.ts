import { createServerFn } from '@tanstack/react-start';
import { CategoryDtoMapper, ICategoryDto } from '@/features/categories/dtos/category-dto.ts';
import { queryOptions } from '@tanstack/react-query';
import { CategoryService } from '@/features/categories/services/category-service.ts';
import { serverZodValidator } from '@/features/shared/utils/server-zod-validator.ts';
import { getCategoryByIdSchema } from '@/features/categories/schemas/get-by-id.ts';



export const getCategoryByIdServerFn = createServerFn({ method: 'GET', })
  .inputValidator(serverZodValidator(getCategoryByIdSchema))
  .handler(async ({ data: { id } }): Promise<ICategoryDto> => {
    const category = await CategoryService.getById(id)

    return CategoryDtoMapper.fromEntity(category);
  });

export const getCategoryByIdQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: ['categories', id],
    queryFn: () => getCategoryByIdServerFn({ data: { id: id} })
  });
}