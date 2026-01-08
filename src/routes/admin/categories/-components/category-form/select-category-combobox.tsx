import { ComponentProps, FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button.tsx';
import { getAllCategoriesQueryOptions } from '@/features/categories/server-functions/get-all.ts';
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


interface IProps extends Omit<ComponentProps<typeof Button>, 'value'> {
  value: number | undefined | null;
  setValue: (value: number | undefined | null) => void;
  disabledIds?: number[];
}

export const SelectCategoryCombobox: FC<IProps> = (props) => {
  const { value, setValue, className, disabled, disabledIds, ...btnProps } = props;
  const { isFetching, data: categories } = useQuery({
    ...getAllCategoriesQueryOptions(),
    gcTime: 0,
    staleTime: 0,
    enabled: !!open
  });

  const selectedCategory = categories?.find((ctg) => ctg.id === value);

  return (
    <Combobox value={value} onValueChange={setValue}>
      <ComboboxTrigger showIcon={!isFetching} disabled={isFetching} {...btnProps}>
        {isFetching ? (
          <>
            <span>Loading</span>
            <Spinner/>
          </>
        ) : (
          <span>
            {selectedCategory ? `${selectedCategory.nameRo} / ${selectedCategory.nameRu}` : 'None'}
          </span>
        )}
      </ComboboxTrigger>

      <ComboboxContent className="w-(--radix-popover-trigger-width)">
        <ComboboxInput placeholder="Search category..."/>

        <ComboboxList>
          <ComboboxEmpty>No categories found.</ComboboxEmpty>

          <ComboboxGroup>
            <ComboboxItem value={undefined} selected={!value}>
              None
            </ComboboxItem>

            {categories?.map((ctg) => (
              <ComboboxItem
                disabled={disabledIds?.includes(ctg.id)}
                selected={value === ctg.id}
                value={ctg.id}
                key={ctg.id}
              >
                {ctg.nameRo} / {ctg.nameRu}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};