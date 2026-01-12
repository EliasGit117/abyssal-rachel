import { ComponentProps, FC, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button.tsx';
import { getCategoryTreeForAdminQueryOptions } from '@/features/categories/admin/server-functions/get-tree.ts';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger
} from '@/components/ui/combobox.tsx';
import { Spinner } from '@/components/ui/spinner.tsx';
import { IAdminCategoryDto } from '@/features/categories/admin/dtos/admin-category-dto.ts';

interface IProps extends Omit<ComponentProps<typeof Button>, 'value'> {
  value: number | null | undefined;
  setValue: (value: number | null | undefined) => void;
  disabledIds?: number[];
}

const valueNoneKey = '__none__';

export const SelectCategoryCombobox: FC<IProps> = ({ value, setValue, disabledIds = [], ...btnProps }) => {
  const { isFetching, data: tree } = useQuery({
    ...getCategoryTreeForAdminQueryOptions(),
    gcTime: 0,
    staleTime: 0
  });

  const flatCategories = useMemo(() => {
    if (!tree) return [];
    return flattenCategories(tree, disabledIds);
  }, [tree, disabledIds]);

  const selectedCategory = flatCategories.find(
    (ctg) => ctg.id === value
  );

  return (
    <Combobox
      value={value ?? valueNoneKey}
      onValueChange={(val) => {
        if (val === valueNoneKey) {
          setValue(undefined);
        } else {
          setValue(Number(val));
        }
      }}
    >
      <ComboboxTrigger showIcon={!isFetching} disabled={isFetching} {...btnProps}>
        {isFetching ? (
          <>
            <span>Loading</span>
            <Spinner/>
          </>
        ) : (
          <span>
            {selectedCategory ? `${selectedCategory.nameRo}` : 'None'}
          </span>
        )}
      </ComboboxTrigger>

      <ComboboxContent className="w-(--radix-popover-trigger-width)">
        <ComboboxInput placeholder="Search category..."/>

        <ComboboxList>
          <ComboboxEmpty>No categories found.</ComboboxEmpty>

          <ComboboxGroup>
            <ComboboxItem value={valueNoneKey} selected={!value}>
              None
            </ComboboxItem>

            {flatCategories.map((ctg) => (
              <ComboboxItem
                key={ctg.id}
                value={ctg.id}
                selected={value === ctg.id}
                disabled={ctg.disabled}
                style={{
                  paddingLeft: `${ctg.level * 16 + 8}px`
                }}
              >
                {ctg.nameRo}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};


interface FlatCategory {
  id: number;
  nameRo: string;
  nameRu: string;
  level: number;
  disabled: boolean;
}

const flattenCategories = (categories: IAdminCategoryDto[], disabledIds: number[] = [], level = 0, parentDisabled = false): FlatCategory[] => {
  return categories.flatMap((category) => {
    const isDisabled = parentDisabled || disabledIds.includes(category.id);

    const current: FlatCategory = {
      id: category.id,
      nameRo: category.nameRo,
      nameRu: category.nameRu,
      level,
      disabled: isDisabled
    };

    const children = category.children?.length ?
      flattenCategories(
        category.children,
        disabledIds,
        level + 1,
        isDisabled
      ) : [];

    return [current, ...children];
  });
};