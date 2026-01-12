import { ComponentProps, FC } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryStatus } from '~/prisma/generated/prisma/enums';
import { IconCircleCheck, IconCircleMinus } from '@tabler/icons-react';
import {
  Combobox,
  ComboboxContent,
  ComboboxGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger
} from '@/components/ui/combobox';
import {
  TCreateCategory,
  TUpdateCategory
} from '@/features/categories/admin/schemas';
import { SelectCategoryCombobox } from './select-category-combobox';

interface Props extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  id?: string;
  form: UseFormReturn<TUpdateCategory | TCreateCategory>;
  onSubmit: (data: TUpdateCategory | TCreateCategory) => void;
  disabled?: boolean;
  disabledIds?: number[];
  loading?: boolean;
}

export const CategoryForm: FC<Props> = (props) => {
  const {
    form,
    onSubmit,
    id,
    disabled,
    disabledIds,
    loading,
    ...formProps
  } = props;

  if (loading) {
    return (
      <form id={id ?? 'category-form'} {...formProps}>
        <FieldGroup>
          <Field>
            <Skeleton className="h-5 w-full max-w-20"/>
            <Skeleton className="h-10 w-full"/>
          </Field>

          <div className="grid sm:grid-cols-2 gap-7">
            <Field>
              <Skeleton className="h-5 w-full max-w-20"/>
              <Skeleton className="h-9 w-full"/>
            </Field>

            <Field>
              <Skeleton className="h-5 w-full max-w-20"/>
              <Skeleton className="h-9 w-full"/>
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-7">
            <Field>
              <Skeleton className="h-5 w-full max-w-20"/>
              <Skeleton className="h-9 w-full"/>
            </Field>

            <Field>
              <Skeleton className="h-5 w-full max-w-20"/>
              <Skeleton className="h-9 w-full"/>
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field>
              <Skeleton className="h-5 w-full max-w-32"/>
              <Skeleton className="h-16 w-full"/>
            </Field>

            <Field>
              <Skeleton className="h-5 w-full max-w-32"/>
              <Skeleton className="h-16 w-full"/>
            </Field>
          </div>
        </FieldGroup>
      </form>
    );
  }

  return (
    <form
      id={id ?? 'category-form'}
      onSubmit={form.handleSubmit(onSubmit)}
      {...formProps}
    >
      <fieldset disabled={disabled}>
        <FieldGroup>
          <Controller
            name="parentId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Parent</FieldLabel>
                <SelectCategoryCombobox
                  value={field.value}
                  setValue={(v) =>
                    field.onChange(v, { shouldValidate: true })
                  }
                  disabled={disabled}
                  disabledIds={disabledIds}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]}/>
                )}
              </Field>
            )}
          />

          <div className="grid sm:grid-cols-2 gap-7">
            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Slug</FieldLabel>
                  <Input {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}/>
                  )}
                </Field>
              )}
            />

            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => {
                const options = [
                  {
                    value: CategoryStatus.ACTIVE,
                    label: 'Active',
                    icon: IconCircleCheck
                  },
                  {
                    value: CategoryStatus.INACTIVE,
                    label: 'Inactive',
                    icon: IconCircleMinus
                  }
                ];

                const selected = options.find(
                  (o) => o.value === field.value
                );

                return (
                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <Combobox
                      value={field.value}
                      onValueChange={(v) =>
                        field.onChange(v, { shouldValidate: true })
                      }
                    >
                      <ComboboxTrigger className="justify-start">
                        {selected && (
                          <selected.icon className="opacity-50"/>
                        )}
                        <span>{selected?.label}</span>
                      </ComboboxTrigger>
                      <ComboboxContent>
                        <ComboboxList>
                          <ComboboxGroup>
                            {options.map((o) => (
                              <ComboboxItem key={o.value} value={o.value}>
                                <o.icon className="opacity-50"/>
                                <span>{o.label}</span>
                              </ComboboxItem>
                            ))}
                          </ComboboxGroup>
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]}/>
                    )}
                  </Field>
                );
              }}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-7">
            <Controller
              name="nameRo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Name RO</FieldLabel>
                  <Input {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}/>
                  )}
                </Field>
              )}
            />

            <Controller
              name="nameRu"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Name RU</FieldLabel>
                  <Input {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}/>
                  )}
                </Field>
              )}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Controller
              name="descriptionRo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Description RO</FieldLabel>
                  <Textarea {...field} value={field.value ?? ''}/>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}/>
                  )}
                </Field>
              )}
            />

            <Controller
              name="descriptionRu"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Description RU</FieldLabel>
                  <Textarea {...field} value={field.value ?? ''}/>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}/>
                  )}
                </Field>
              )}
            />
          </div>
        </FieldGroup>
      </fieldset>
    </form>
  );
};