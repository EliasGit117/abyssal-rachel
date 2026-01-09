import { RowData } from '@tanstack/react-table';
import { ReactNode } from 'react';
import { Icon } from '@tabler/icons-react';

export enum ColumnFilterType {
  Text = 'text',
  Number = 'number',
  NumberRange = 'number-range',
  Select = 'select',
  MultiSelect = 'multi-select',
  Date = 'date',
  DateRange = 'date-range',
}

export interface ITextFilterOptions {
  type: ColumnFilterType.Text;
  placeholder?: string;
}

export interface INumberFilterOptions {
  type: ColumnFilterType.Number;
  min?: number;
  max?: number;
  placeholder?: string;
}

export interface INumberRangeFilterOptions {
  type: ColumnFilterType.NumberRange;
  min?: number;
  max?: number;
  unit?: string;
}

export type TFacetedOptionValue = string | number | boolean;

export interface IFacetedOption {
  title: string;
  value: TFacetedOptionValue;
  icon?: Icon;
  count?: number;
}

export interface ISelectOptions {
  type: ColumnFilterType.Select;
  options: IFacetedOption[];
}

export interface IMultiSelectOptions {
  type: ColumnFilterType.MultiSelect;
  options: IFacetedOption[];
}

export interface IDateOptions {
  type: ColumnFilterType.Date;
  disabledBefore?: Date;
  disabledAfter?: Date;
}

export interface IDateRangeOptions {
  type: ColumnFilterType.DateRange;
  disabledBefore?: Date;
  disabledAfter?: Date;
}

export type TColumnFilterOptions =
  | ITextFilterOptions
  | INumberFilterOptions
  | INumberRangeFilterOptions
  | ISelectOptions
  | IMultiSelectOptions
  | IDateOptions
  | IDateRangeOptions;



declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    key?: string;
    filter?: TColumnFilterOptions;
    label?: string;
    icon?: Icon;
    skeletonClassName?: string;
    skeletonItem?: ReactNode;
  }
}