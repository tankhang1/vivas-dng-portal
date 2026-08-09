import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui';

type InputProps = ComponentPropsWithoutRef<typeof Input>;

type FormInputFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  label: ReactNode;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  inputProps?: Omit<
    InputProps,
    'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'ref'
  >;
};

export function FormInputField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  required,
  className,
  inputClassName,
  inputProps,
}: FormInputFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <FormControl>
            <Input {...field} {...inputProps} className={inputClassName} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
