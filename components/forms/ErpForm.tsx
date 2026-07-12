"use client";

import { useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import type { z } from "zod";
import { erpSchema } from "@/lib/content/schemas";
import type { ErpContent } from "@/lib/content/types";
import { saveContentAction } from "@/lib/content/actions";
import { TextField } from "./fields/TextField";
import { MarkdownBodyField } from "./fields/MarkdownBodyField";
import { SelectField } from "./fields/SelectField";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = [
  { value: "draft", label: "Rascunho" },
  { value: "active", label: "Ativo" },
  { value: "done", label: "Concluído" },
];

const STATUS_INTEGRACAO_OPTIONS = [
  { value: "nao-iniciado", label: "Não iniciado" },
  { value: "em-andamento", label: "Em andamento" },
  { value: "concluido", label: "Concluído" },
];

export interface ErpFormProps {
  defaultValues: Partial<ErpContent>;
}

export function ErpForm({ defaultValues }: ErpFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.input<typeof erpSchema>, unknown, ErpContent>({
    resolver: zodResolver(erpSchema),
    defaultValues: {
      title: "ERP",
      status: "draft",
      erp_atual: "",
      status_integracao: "nao-iniciado",
      notas: "",
      ...defaultValues,
    },
  });
  // As field primitives em components/forms/fields/ tipam `control` como
  // `Control<any>` (contrato fixo, não editável aqui). O RHF 7.81 gera um
  // mismatch estrutural estrito ao atribuir um Control fortemente tipado a
  // essa assinatura; cast local e explícito é o contorno mínimo, sem alterar
  // as primitivas compartilhadas.
  const control = form.control as Control<any>;

  function onSubmit(values: ErpContent) {
    startTransition(async () => {
      const result = await saveContentAction("erp", values);
      if (!result.ok && result.errors) {
        for (const [field, message] of Object.entries(result.errors)) {
          form.setError(field as keyof ErpContent, { message });
        }
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <TextField control={control} name="erp_atual" label="ERP atual" />
      <SelectField
        control={control}
        name="status_integracao"
        label="Status de integração"
        options={STATUS_INTEGRACAO_OPTIONS}
      />
      <MarkdownBodyField control={control} name="notas" label="Notas" />
      <SelectField control={control} name="status" label="Status" options={STATUS_OPTIONS} />
      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
