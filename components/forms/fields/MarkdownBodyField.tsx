"use client";

import { Controller, type Control } from "react-hook-form";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export interface MarkdownBodyFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label: string;
}

/**
 * Textarea grande para o corpo Markdown da página (campo indicado por `bodyField`
 * no registry). Sem WYSIWYG — textarea simples, consistente com o BRIEFING.
 */
export function MarkdownBodyField({ control, name, label }: MarkdownBodyFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Textarea
            id={name}
            rows={12}
            aria-invalid={fieldState.invalid}
            className="font-mono text-sm"
            {...field}
            value={field.value ?? ""}
          />
          <FieldDescription>Markdown simples — sem editor rich-text.</FieldDescription>
          <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
        </Field>
      )}
    />
  );
}
