"use client";

import { useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import type { z } from "zod";
import { perfilIdealDeClienteSchema } from "@/lib/content/schemas";
import type { PerfilIdealDeClienteContent } from "@/lib/content/types";
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

export interface PerfilIdealDeClienteFormProps {
  defaultValues: Partial<PerfilIdealDeClienteContent>;
}

export function PerfilIdealDeClienteForm({ defaultValues }: PerfilIdealDeClienteFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.input<typeof perfilIdealDeClienteSchema>, unknown, PerfilIdealDeClienteContent>({
    resolver: zodResolver(perfilIdealDeClienteSchema),
    defaultValues: {
      title: "Perfil Ideal de Cliente",
      status: "draft",
      descricao: "",
      dores: [],
      objetivos: [],
      onde_encontrar: "",
      criterios_qualificacao: "",
      ...defaultValues,
    },
  });
  // As field primitives em components/forms/fields/ tipam `control` como
  // `Control<any>` (contrato fixo, não editável aqui). O RHF 7.81 gera um
  // mismatch estrutural estrito ao atribuir um Control fortemente tipado a
  // essa assinatura (ver props.name em ValidateForm); cast local e explícito
  // é o contorno mínimo, sem alterar as primitivas compartilhadas.
  const control = form.control as Control<any>;

  function onSubmit(values: PerfilIdealDeClienteContent) {
    startTransition(async () => {
      const result = await saveContentAction("perfil-ideal-de-cliente", values);
      if (!result.ok && result.errors) {
        for (const [field, message] of Object.entries(result.errors)) {
          form.setError(field as keyof PerfilIdealDeClienteContent, { message });
        }
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <MarkdownBodyField control={control} name="descricao" label="Descrição" />
      <RepeatableListField
        control={control}
        name="dores"
        label="Dores"
        layout="list"
        newItem=""
        renderItem={(index) => (
          <TextField control={control} name={`dores.${index}`} label={`Dor ${index + 1}`} />
        )}
        emptyMessage="Nenhuma dor adicionada ainda."
        addLabel="Adicionar dor"
      />
      <RepeatableListField
        control={control}
        name="objetivos"
        label="Objetivos"
        layout="list"
        newItem=""
        renderItem={(index) => (
          <TextField control={control} name={`objetivos.${index}`} label={`Objetivo ${index + 1}`} />
        )}
        emptyMessage="Nenhum objetivo adicionado ainda."
        addLabel="Adicionar objetivo"
      />
      <TextareaField control={control} name="onde_encontrar" label="Onde encontrar" />
      <TextareaField
        control={control}
        name="criterios_qualificacao"
        label="Critérios de qualificação"
      />
      <SelectField control={control} name="status" label="Status" options={STATUS_OPTIONS} />
      <Button type="submit" disabled={isPending}>
        Salvar
      </Button>
    </form>
  );
}
