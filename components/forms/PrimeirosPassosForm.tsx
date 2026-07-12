"use client";

import { useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import type { z } from "zod";
import { primeirosPassosSchema } from "@/lib/content/schemas";
import type { PrimeirosPassosContent } from "@/lib/content/types";
import { saveContentAction } from "@/lib/content/actions";
import { TextField } from "./fields/TextField";
import { SelectField } from "./fields/SelectField";
import { RepeatableListField } from "./fields/RepeatableListField";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/content/ContentCard";
import { ViewToggle } from "@/components/content/ViewToggle";
import { useViewMode } from "@/components/content/ViewModeProvider";

const STATUS_OPTIONS = [
  { value: "draft", label: "Rascunho" },
  { value: "active", label: "Ativo" },
  { value: "done", label: "Concluído" },
];

const PASSO_STATUS_OPTIONS = [
  { value: "todo", label: "A fazer" },
  { value: "em-andamento", label: "Em andamento" },
  { value: "concluido", label: "Concluído" },
  { value: "bloqueado", label: "Bloqueado" },
];

export interface PrimeirosPassosFormProps {
  defaultValues: Partial<PrimeirosPassosContent>;
}

export function PrimeirosPassosForm({ defaultValues }: PrimeirosPassosFormProps) {
  const [isPending, startTransition] = useTransition();
  const { mode } = useViewMode();

  const form = useForm<z.input<typeof primeirosPassosSchema>, unknown, PrimeirosPassosContent>({
    resolver: zodResolver(primeirosPassosSchema),
    defaultValues: {
      title: "Primeiros Passos",
      status: "draft",
      passos: [],
      ...defaultValues,
    },
  });
  // As field primitives em components/forms/fields/ tipam `control` como
  // `Control<any>` (contrato fixo, não editável aqui). O RHF 7.81 gera um
  // mismatch estrutural estrito ao atribuir um Control fortemente tipado a
  // essa assinatura (ver props.name em ValidateForm); cast local e explícito
  // é o contorno mínimo, sem alterar as primitivas compartilhadas.
  const control = form.control as Control<any>;

  function onSubmit(values: PrimeirosPassosContent) {
    startTransition(async () => {
      const result = await saveContentAction("primeiros-passos", values);
      if (!result.ok && result.errors) {
        for (const [field, message] of Object.entries(result.errors)) {
          form.setError(field as keyof PrimeirosPassosContent, { message });
        }
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <ContentCard title="Contexto">
        <SelectField control={control} name="status" label="Status" options={STATUS_OPTIONS} />
      </ContentCard>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-foreground">Passos</h2>
          <ViewToggle />
        </div>
        <RepeatableListField
          control={control}
          name="passos"
          label="Lista de passos"
          layout={mode}
          newItem={{ id: "", descricao: "", prazo: "", responsavel: "", status: "todo" }}
          renderItem={(index) => (
            <>
              <TextField
                control={control}
                name={`passos.${index}.id`}
                label="ID"
                placeholder="ex.: passo-1"
              />
              <TextField
                control={control}
                name={`passos.${index}.descricao`}
                label="Descrição"
              />
              <TextField
                control={control}
                name={`passos.${index}.prazo`}
                label="Prazo"
                placeholder="ex.: 2026-07-20"
              />
              <TextField
                control={control}
                name={`passos.${index}.responsavel`}
                label="Responsável"
              />
              <SelectField
                control={control}
                name={`passos.${index}.status`}
                label="Status"
                options={PASSO_STATUS_OPTIONS}
              />
            </>
          )}
          emptyMessage="Nenhum passo adicionado ainda."
          addLabel="Adicionar passo"
        />
      </div>

      <Button type="submit" disabled={isPending}>
        Salvar
      </Button>
    </form>
  );
}
