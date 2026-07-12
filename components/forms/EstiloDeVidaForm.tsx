"use client";

import { Controller, useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import { estiloDeVidaSchema } from "@/lib/content/schemas";
import type { EstiloDeVidaContent } from "@/lib/content/types";
import { saveContentAction } from "@/lib/content/actions";
import { TextField } from "./fields/TextField";
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

export interface EstiloDeVidaFormProps {
  defaultValues: Partial<EstiloDeVidaContent>;
}

export function EstiloDeVidaForm({ defaultValues }: EstiloDeVidaFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.input<typeof estiloDeVidaSchema>, unknown, EstiloDeVidaContent>({
    resolver: zodResolver(estiloDeVidaSchema),
    defaultValues: {
      title: "Estilo de Vida",
      status: "draft",
      rotina_desejada: "",
      renda_alvo: "",
      horas_por_semana: "",
      flexibilidade_localizacao: "",
      ...defaultValues,
    },
  });
  // As field primitives em components/forms/fields/ tipam `control` como
  // `Control<any>` (contrato fixo, não editável aqui). O RHF 7.81 gera um
  // mismatch estrutural estrito ao atribuir um Control fortemente tipado a
  // essa assinatura (ver props.name em ValidateForm); cast local e explícito
  // é o contorno mínimo, sem alterar as primitivas compartilhadas.
  const control = form.control as Control<any>;

  function onSubmit(values: EstiloDeVidaContent) {
    startTransition(async () => {
      const result = await saveContentAction("estilo-de-vida", values);
      if (!result.ok && result.errors) {
        for (const [field, message] of Object.entries(result.errors)) {
          form.setError(field as keyof EstiloDeVidaContent, { message });
        }
        toast.error("Não foi possível salvar o Estilo de Vida.");
        return;
      }
      toast.success("Estilo de Vida salvo com sucesso.");
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <TextField
        control={control}
        name="rotina_desejada"
        label="Rotina desejada"
        placeholder="Como você quer que seus dias sejam?"
      />
      <TextField
        control={control}
        name="renda_alvo"
        label="Renda alvo"
        placeholder="Ex.: R$ 25.000/mês"
      />
      <TextField
        control={control}
        name="horas_por_semana"
        label="Horas por semana"
        placeholder="Ex.: 30 horas"
      />
      <TextField
        control={control}
        name="flexibilidade_localizacao"
        label="Flexibilidade de localização"
        placeholder="Remoto, híbrido, fixo..."
      />

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
