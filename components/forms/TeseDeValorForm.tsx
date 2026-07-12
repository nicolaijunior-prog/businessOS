"use client";

import { useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import type { z } from "zod";
import { teseDeValorSchema } from "@/lib/content/schemas";
import type { TeseDeValorContent } from "@/lib/content/types";
import { saveContentAction } from "@/lib/content/actions";
import { TextField } from "./fields/TextField";
import { TextareaField } from "./fields/TextareaField";
import { MarkdownBodyField } from "./fields/MarkdownBodyField";
import { SelectField } from "./fields/SelectField";
import { RepeatableListField } from "./fields/RepeatableListField";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = [
  { value: "draft", label: "Rascunho" },
  { value: "active", label: "Ativo" },
  { value: "done", label: "Concluído" },
];

export interface TeseDeValorFormProps {
  defaultValues: Partial<TeseDeValorContent>;
}

export function TeseDeValorForm({ defaultValues }: TeseDeValorFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.input<typeof teseDeValorSchema>, unknown, TeseDeValorContent>({
    resolver: zodResolver(teseDeValorSchema),
    defaultValues: {
      title: "Tese de Valor",
      status: "draft",
      proposta_valor: "",
      diferenciacao: "",
      hipoteses_centrais: [],
      ...defaultValues,
    },
  });
  // As field primitives em components/forms/fields/ tipam `control` como
  // `Control<any>` (contrato fixo, não editável aqui). O RHF 7.81 gera um
  // mismatch estrutural estrito ao atribuir um Control fortemente tipado a
  // essa assinatura (ver props.name em ValidateForm); cast local e explícito
  // é o contorno mínimo, sem alterar as primitivas compartilhadas.
  const control = form.control as Control<any>;

  function onSubmit(values: TeseDeValorContent) {
    startTransition(async () => {
      const result = await saveContentAction("tese-de-valor", values);
      if (!result.ok && result.errors) {
        for (const [field, message] of Object.entries(result.errors)) {
          form.setError(field as keyof TeseDeValorContent, { message });
        }
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <MarkdownBodyField control={control} name="proposta_valor" label="Proposta de valor" />
      <TextareaField control={control} name="diferenciacao" label="Diferenciação" />
      <RepeatableListField
        control={control}
        name="hipoteses_centrais"
        label="Hipóteses centrais"
        layout="list"
        newItem=""
        renderItem={(index) => (
          <TextField
            control={control}
            name={`hipoteses_centrais.${index}`}
            label={`Hipótese ${index + 1}`}
          />
        )}
        emptyMessage="Nenhuma hipótese adicionada ainda."
        addLabel="Adicionar hipótese"
      />
      <SelectField control={control} name="status" label="Status" options={STATUS_OPTIONS} />
      <Button type="submit" disabled={isPending}>
        Salvar
      </Button>
    </form>
  );
}
