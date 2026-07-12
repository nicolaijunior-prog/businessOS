"use client";

import { useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import type { z } from "zod";
import { fluxoDeCaixaSchema } from "@/lib/content/schemas";
import type { FluxoDeCaixaContent } from "@/lib/content/types";
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

export interface FluxoDeCaixaFormProps {
  defaultValues: Partial<FluxoDeCaixaContent>;
}

/**
 * Snapshot mensal simples de caixa (não um livro-razão): mês de referência,
 * entradas/saídas/saldo agregados e notas em markdown. Página de campo único.
 */
export function FluxoDeCaixaForm({ defaultValues }: FluxoDeCaixaFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.input<typeof fluxoDeCaixaSchema>, unknown, FluxoDeCaixaContent>({
    resolver: zodResolver(fluxoDeCaixaSchema),
    defaultValues: {
      title: "Fluxo de Caixa",
      status: "draft",
      mes_referencia: "",
      entradas: 0,
      saidas: 0,
      saldo: 0,
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

  function onSubmit(values: FluxoDeCaixaContent) {
    startTransition(async () => {
      const result = await saveContentAction("fluxo-de-caixa", values);
      if (!result.ok && result.errors) {
        for (const [field, message] of Object.entries(result.errors)) {
          form.setError(field as keyof FluxoDeCaixaContent, { message });
        }
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <TextField
        control={control}
        name="mes_referencia"
        label="Mês de referência"
        placeholder="Ex.: 2026-07"
      />
      <TextField control={control} name="entradas" label="Entradas" placeholder="0" />
      <TextField control={control} name="saidas" label="Saídas" placeholder="0" />
      <TextField control={control} name="saldo" label="Saldo" placeholder="0" />
      <MarkdownBodyField control={control} name="notas" label="Notas" />
      <SelectField control={control} name="status" label="Status" options={STATUS_OPTIONS} />
      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
