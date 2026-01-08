import { ComponentProps, FC } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { TCreateCategory } from '@/features/categories/admin/schemas';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';

import { CategoryStatus } from '~/prisma/generated/prisma/enums.ts';
import { IconCircleCheck, IconCircleMinus } from '@tabler/icons-react';
import {
  SelectCategoryCombobox
} from '@/routes/admin/categories/-components/category-form/select-category-combobox.tsx';
import {
  Combobox,
  ComboboxContent,
  ComboboxGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger
} from '@/components/ui/combobox.tsx';


interface IProps extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  id?: string;
  form: UseFormReturn<TCreateCategory>;
  onSubmit: (data: TCreateCategory) => void;
  disabled?: boolean;
}

export const CreateCategoryForm: FC<IProps> = ({ form, onSubmit, id, disabled, ...props }) => {

  return (
    <form
      id={id ?? 'create-category-form'}
      onSubmit={form.handleSubmit(onSubmit)}
      method="post"
      {...props}
    >
      <fieldset disabled={disabled}>
        <FieldGroup>

          <Controller
            name="parentId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="parent-id-combobox">
                  Parent
                </FieldLabel>
                <SelectCategoryCombobox
                  id='parent-id-combobox'
                  value={field.value}
                  setValue={v => field.onChange(v, { shouldValidate: true })}
                  disabled={disabled}
                />
                {fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)}
              </Field>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="slug-input">
                    Slug
                  </FieldLabel>
                  <Input
                    {...field}
                    id="slug-input"
                    name="slug"
                    aria-invalid={fieldState.invalid}
                    placeholder="some-slug-for-category"
                  />
                  {fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)}
                </Field>
              )}
            />

            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => {
                const statusOptions = [
                  { value: CategoryStatus.ACTIVE, label: 'Active', icon: IconCircleCheck },
                  { value: CategoryStatus.INACTIVE, label: 'Inactive', icon: IconCircleMinus }
                ];

                const selectedStatus = statusOptions.find((s) => s.value === field.value);

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="status-dropdown">
                      Status
                    </FieldLabel>

                    <Combobox
                      value={field.value}
                      onValueChange={(v) =>
                        field.onChange(v, { shouldValidate: true })
                      }
                    >
                      <ComboboxTrigger id='status-dropdown' className='justify-start' disabled={field.disabled}>
                        {selectedStatus && (<selectedStatus.icon className='opacity-50'/>)}
                        <span>{selectedStatus ? selectedStatus.label : 'Select status'}</span>
                      </ComboboxTrigger>


                      <ComboboxContent className="w-(--radix-popover-trigger-width)">
                        <ComboboxList>
                          <ComboboxGroup>
                            {statusOptions.map((status) => (
                              <ComboboxItem
                                key={status.value}
                                value={status.value}
                                selected={field.value === status.value}
                              >
                                <status.icon className='opacity-50'/>
                                <span>{status.label}</span>
                              </ComboboxItem>
                            ))}
                          </ComboboxGroup>
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>

                    {fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)}
                  </Field>
                );
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
            <Controller
              name="nameRo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name-ro-input">
                    Name RO
                  </FieldLabel>
                  <Input
                    {...field}
                    id="name-ro-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Caterorie"
                  />
                  {fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)}
                </Field>
              )}
            />

            <Controller
              name="nameRu"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name-ru-input">
                    Name RU
                  </FieldLabel>
                  <Input
                    {...field}
                    id="name-ru-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Категория"
                  />
                  {fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)}
                </Field>
              )}
            />
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="descriptionRo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description-ro-input">
                    Description RO
                  </FieldLabel>
                  <Textarea
                    {...field}
                    value={field.value ?? ''}
                    className="min-h-24 max-h-42"
                    id="description-ro-input"
                    placeholder="Descriere de categorie"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)}
                </Field>
              )}
            />

            <Controller
              name="descriptionRu"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description-ru-input">
                    Description RU
                  </FieldLabel>
                  <Textarea
                    {...field}
                    value={field.value ?? ''}
                    id="description-ru-input"
                    placeholder="Описание категории"
                    aria-invalid={fieldState.invalid}
                    className="min-h-24 max-h-42"
                  />
                  {fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)}
                </Field>
              )}
            />
          </div>


        </FieldGroup>
      </fieldset>
    </form>
  );
};