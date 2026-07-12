"use client";

import { Controller, useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import { objetivoSchema } from "@/lib/content/schemas";
import type { ObjetivoContent } from "@/lib/content/types";
import { saveContentAction } from "@/lib/content/actions";
import { TextField } from "./fields/TextField";
import { MarkdownBodyField } from "./fields/MarkdownBodyField";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_OPTIONS = [
  { value: "draft", label: "Rascunho" },
  { value: "active", label: "Ativo" },
  { value: "done", label: "Concluído" },
];

export interface ObjetivoFormProps {
  defaultValues: Partial<ObjetivoContent>;
}

export function ObjetivoForm({ defaultValues }: ObjetivoFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.input<typeof objetivoSchema>, unknown, ObjetivoContent>({
    resolver: zodResolver(objetivoSchema),
    defaultValues: {
      title: "Objetivo",
      status: "draft",
      objetivo_principal: "",
      horizonte_tempo: "",
      metricas_sucesso: "",
      motivacao: "",
      ...defaultValues,
    },
  });
  // As field primitives em components/forms/fields/ tipam `control` como
  // `Control<any>` (contrato fixo, não editável aqui). O RHF 7.81 gera um
  // mismatch estrutural estrito ao atribuir um Control fortemente tipado a
  // essa assinatura (ver props.name em ValidateForm); cast local e explícito
  // é o contorno mínimo, sem alterar as primitivas compartilhadas.
  const control = form.control as Control<any>;

  function onSubmit(values: ObjetivoContent) {
    startTransition(async () => {
      const result = await saveContentAction("objetivo", values);
      if (!result.ok && result.errors) {
        for (const [field, message] of Object.entries(result.errors)) {
          form.setError(field as keyof ObjetivoContent, { message });
        }
        toast.error("Não foi possível salvar o Objetivo.");
        return;
      }
      toast.success("Objetivo salvo com sucesso.");
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <TextField
        control={control}
        name="objetivo_principal"
        label="Objetivo principal"
        placeholder="Qual é o objetivo principal do negócio?"
      />
      <TextField
        control={control}
        name="horizonte_tempo"
        label="Horizonte de tempo"
        placeholder="Ex.: 18 meses"
      />
      <TextField
        control={control}
        name="metricas_sucesso"
        label="Métricas de sucesso"
        placeholder="Como você vai saber que atingiu o objetivo?"
      />
      <MarkdownBodyField control={control} name="motivacao" label="Motivação" />

      <Controller
        control={control}
        name="status"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <Select
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <SelectTrigger id="status" aria-invalid={fieldState.invalid} className="w-full">
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
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

      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
