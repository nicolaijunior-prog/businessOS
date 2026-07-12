"use client";

import { useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import type { z } from "zod";
import { mapaDoMercadoSchema } from "@/lib/content/schemas";
import type { MapaDoMercadoContent } from "@/lib/content/types";
import { saveContentAction } from "@/lib/content/actions";
import { TextField } from "./fields/TextField";
import { TextareaField } from "./fields/TextareaField";
import { MarkdownBodyField } from "./fields/MarkdownBodyField";
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

export interface MapaDoMercadoFormProps {
  defaultValues: Partial<MapaDoMercadoContent>;
}

export function MapaDoMercadoForm({ defaultValues }: MapaDoMercadoFormProps) {
  const [isPending, startTransition] = useTransition();
  const { mode } = useViewMode();

  const form = useForm<z.input<typeof mapaDoMercadoSchema>, unknown, MapaDoMercadoContent>({
    resolver: zodResolver(mapaDoMercadoSchema),
    defaultValues: {
      title: "Mapa do Mercado",
      status: "draft",
      tamanho_mercado: "",
      segmentos: [],
      concorrentes: [],
      tendencias: "",
      ...defaultValues,
    },
  });
  // As field primitives em components/forms/fields/ tipam `control` como
  // `Control<any>` (contrato fixo, não editável aqui). O RHF 7.81 gera um
  // mismatch estrutural estrito ao atribuir um Control fortemente tipado a
  // essa assinatura (ver props.name em ValidateForm); cast local e explícito
  // é o contorno mínimo, sem alterar as primitivas compartilhadas.
  const control = form.control as Control<any>;

  function onSubmit(values: MapaDoMercadoContent) {
    startTransition(async () => {
      const result = await saveContentAction("mapa-do-mercado", values);
      if (!result.ok && result.errors) {
        for (const [field, message] of Object.entries(result.errors)) {
          form.setError(field as keyof MapaDoMercadoContent, { message });
        }
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <ContentCard title="Contexto de mercado">
        <TextField
          control={control}
          name="tamanho_mercado"
          label="Tamanho do mercado"
        />
        <RepeatableListField
          control={control}
          name="segmentos"
          label="Segmentos"
          layout="list"
          newItem=""
          renderItem={(index) => (
            <TextField
              control={control}
              name={`segmentos.${index}`}
              label={`Segmento ${index + 1}`}
            />
          )}
          emptyMessage="Nenhum segmento adicionado ainda."
          addLabel="Adicionar segmento"
        />
        <MarkdownBodyField control={control} name="tendencias" label="Tendências" />
        <SelectField control={control} name="status" label="Status" options={STATUS_OPTIONS} />
      </ContentCard>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-foreground">Concorrentes</h2>
          <ViewToggle />
        </div>
        <RepeatableListField
          control={control}
          name="concorrentes"
          label="Lista de concorrentes"
          layout={mode}
          newItem={{ nome: "", descricao: "" }}
          renderItem={(index) => (
            <>
              <TextField control={control} name={`concorrentes.${index}.nome`} label="Nome" />
              <TextareaField
                control={control}
                name={`concorrentes.${index}.descricao`}
                label="Descrição"
              />
            </>
          )}
          emptyMessage="Nenhum concorrente adicionado ainda."
          addLabel="Adicionar concorrente"
        />
      </div>

      <Button type="submit" disabled={isPending}>
        Salvar
      </Button>
    </form>
  );
}
