"use client";

import { useForm, useWatch, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import type { z } from "zod";
import { mapaEImaDeProblemasSchema } from "@/lib/content/schemas";
import type { MapaEImaDeProblemasContent } from "@/lib/content/types";
import { saveContentAction } from "@/lib/content/actions";
import { TextField } from "./fields/TextField";
import { TextareaField } from "./fields/TextareaField";
import { SelectField } from "./fields/SelectField";
import { RepeatableListField } from "./fields/RepeatableListField";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentCard } from "@/components/content/ContentCard";
import { ViewToggle } from "@/components/content/ViewToggle";
import { useViewMode } from "@/components/content/ViewModeProvider";

const STATUS_OPTIONS = [
  { value: "draft", label: "Rascunho" },
  { value: "active", label: "Ativo" },
  { value: "done", label: "Concluído" },
];

export interface MapaEImaDeProblemasFormProps {
  defaultValues: Partial<MapaEImaDeProblemasContent>;
}

export function MapaEImaDeProblemasForm({ defaultValues }: MapaEImaDeProblemasFormProps) {
  const [isPending, startTransition] = useTransition();
  const { mode } = useViewMode();

  const form = useForm<z.input<typeof mapaEImaDeProblemasSchema>, unknown, MapaEImaDeProblemasContent>({
    resolver: zodResolver(mapaEImaDeProblemasSchema),
    defaultValues: {
      title: "Mapa e Ímã de Problemas",
      status: "draft",
      problemas: [],
      problema_core_id: "",
      ...defaultValues,
    },
  });
  // As field primitives em components/forms/fields/ tipam `control` como
  // `Control<any>` (contrato fixo, não editável aqui). O RHF 7.81 gera um
  // mismatch estrutural estrito ao atribuir um Control fortemente tipado a
  // essa assinatura (ver props.name em ValidateForm); cast local e explícito
  // é o contorno mínimo, sem alterar as primitivas compartilhadas.
  const control = form.control as Control<any>;

  // Opções do select de problema-core são geradas dinamicamente a partir do
  // estado atual do array `problemas` — nunca um id livre (RF3.8 do PRD, §11).
  const problemas = useWatch({ control: form.control, name: "problemas" }) ?? [];
  const problemaCoreId = useWatch({ control: form.control, name: "problema_core_id" });

  const coreOptions = problemas
    .filter((problema) => Boolean(problema?.id?.trim()))
    .map((problema) => ({
      value: problema.id,
      label: problema.titulo?.trim() ? problema.titulo : problema.id,
    }));

  function onSubmit(values: MapaEImaDeProblemasContent) {
    startTransition(async () => {
      const result = await saveContentAction("mapa-e-ima-de-problemas", values);
      if (!result.ok && result.errors) {
        for (const [field, message] of Object.entries(result.errors)) {
          form.setError(field as keyof MapaEImaDeProblemasContent, { message });
        }
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <ContentCard title="Contexto">
        <SelectField
          control={control}
          name="problema_core_id"
          label="Problema-ímã (core)"
          options={coreOptions}
          placeholder="Selecione o problema-chave"
        />
        <SelectField control={control} name="status" label="Status" options={STATUS_OPTIONS} />
      </ContentCard>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-foreground">Problemas</h2>
          <ViewToggle />
        </div>
        <RepeatableListField
          control={control}
          name="problemas"
          label="Lista de problemas"
          layout={mode}
          newItem={{ id: "", titulo: "", descricao: "", evidencia: "" }}
          renderItem={(index) => {
            const item = problemas[index];
            const isCore = Boolean(item?.id?.trim()) && item.id === problemaCoreId;
            return (
              <>
                {isCore && (
                  <Badge variant="default" className="w-fit">
                    Ímã 🧲 Problema-chave
                  </Badge>
                )}
                <TextField
                  control={control}
                  name={`problemas.${index}.id`}
                  label="ID"
                  placeholder="ex.: prob-1"
                />
                <TextField control={control} name={`problemas.${index}.titulo`} label="Título" />
                <TextareaField
                  control={control}
                  name={`problemas.${index}.descricao`}
                  label="Descrição"
                />
                <TextareaField
                  control={control}
                  name={`problemas.${index}.evidencia`}
                  label="Evidência"
                />
              </>
            );
          }}
          emptyMessage="Nenhum problema adicionado ainda."
          addLabel="Adicionar problema"
        />
      </div>

      <Button type="submit" disabled={isPending}>
        Salvar
      </Button>
    </form>
  );
}
