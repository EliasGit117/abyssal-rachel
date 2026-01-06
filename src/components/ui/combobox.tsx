'use client';

import { IconSelector, IconX } from '@tabler/icons-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { ComponentProps, createContext, ReactNode, useContext, useState } from 'react';


interface ComboboxContextValue<T> {
  value: T | null | undefined;
  setValue: (value: T | null | undefined) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ComboboxContext = createContext<ComboboxContextValue<any> | null>(null);

function useComboboxContext() {
  const ctx = useContext(ComboboxContext);
  if (!ctx) {
    throw new Error('Combobox components must be used within <Combobox />');
  }
  return ctx;
}


interface ComboboxProps<T> {
  value: T | null | undefined;
  onValueChange: (value: T | null | undefined) => void;
  children: ReactNode;
}

function Combobox<T>({ value, onValueChange, children }: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <ComboboxContext.Provider value={{ value, setValue: onValueChange, open, setOpen }}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </ComboboxContext.Provider>
  );
}


interface ComboboxTriggerProps
  extends ComponentProps<typeof Button> {
  placeholder?: string;
  showIcon?: boolean;
}

function ComboboxTrigger(props: ComboboxTriggerProps) {
  const { showIcon = true, className, children, placeholder = 'Select...', asChild, ...btnProps } = props;
  const { open, value } = useComboboxContext();

  return (
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn('w-full justify-between gap-2 font-normal', !value && 'text-muted-foreground', className)}
        asChild={asChild}
        {...btnProps}
      >
        {children ? (
          asChild ? (children) : (
            <>
              {children}
              {showIcon && <IconSelector className="size-4 opacity-50 ml-auto"/>}
            </>
          )
        ) : (
          <>
            <span className="truncate">{placeholder}</span>
            <IconSelector className="size-4 opacity-50"/>
          </>
        )}
      </Button>
    </PopoverTrigger>
  );
}


interface ComboboxContentProps extends ComponentProps<typeof PopoverContent> {
}

function ComboboxContent({ className, children, ...props }: ComboboxContentProps) {
  return (
    <PopoverContent className={cn('p-0 gap-1 dark', className)} {...props}>
      <Command className="space-y-1">{children}</Command>
    </PopoverContent>
  );
}


interface ComboboxInputProps
  extends ComponentProps<typeof CommandInput> {
}

function ComboboxInput({ className, ...props }: ComboboxInputProps) {
  return (
    <CommandInput
      wrapperClassName="p-0"
      groupClassName="rounded-sm!"
      className={cn('h-9', className)}
      {...props}
    />
  );
}


function ComboboxList({ className, ...props }: ComponentProps<typeof CommandList>) {
  return (
    <CommandList className={className} {...props} />
  );
}

function ComboboxEmpty(props: ComponentProps<typeof CommandEmpty>) {
  return <CommandEmpty {...props} />;
}

function ComboboxGroup({ className, ...props }: ComponentProps<typeof CommandGroup>) {
  return <CommandGroup className={cn('p-0', className)} {...props} />;
}


interface ComboboxItemProps<T> extends Omit<ComponentProps<typeof CommandItem>, 'onSelect' | 'value'> {
  value: T;
  selected?: boolean;
}

function ComboboxItem<T>({ value, selected, children, ...props }: ComboboxItemProps<T>) {
  const { setValue, setOpen } = useComboboxContext();

  return (
    <CommandItem
      {...props}
      data-checked={selected}
      onSelect={() => {
        setValue(value);
        setOpen(false);
      }}
      className={cn('flex items-center justify-between', props.className)}
    >
      {children}
    </CommandItem>
  );
}


function ComboboxClear() {
  const { setValue } = useComboboxContext();

  return (
    <Button variant="ghost" size="icon-xs" onClick={() => setValue(undefined)}>
      <IconX className="size-4"/>
    </Button>
  );
}


export {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxGroup,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxClear
};