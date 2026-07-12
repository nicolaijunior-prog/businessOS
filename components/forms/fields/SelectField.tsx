"use client";

import { Controller, type Control } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectFieldOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label: string;
  options: SelectFieldOption[];
  placeholder?: string;
}

/**
 * Select do shadcn + label + erro do react-hook-form, para todo campo enum
 * (ex.: `status`, `status_validacao`, `status_integracao`, `problema_core_id`
 * com opções dinâmicas).
 */
export function SelectField({ control, name, label, options, placeholder }: SelectFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Select value={field.value ?? ""} onValueChange={field.onChange}>
            <SelectTrigger id={name} aria-invalid={fieldState.invalid} className="w-full">
              <SelectValue placeholder={placeholder ?? "Selecione..."} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
        </Field>
      )}
    />
  );
}
