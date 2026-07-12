"use client";

import { useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import type { z } from "zod";
import { ofertaSchema } from "@/lib/content/schemas";
import type { OfertaContent } from "@/lib/content/types";
import { saveContentAction } from "@/lib/content/actions";
import { TextField } from "./fields/TextField";
import { TextareaField } from "./fields/TextareaField";
import { MarkdownBodyField } from "./fields/MarkdownBodyField";
import { SelectField } from "./fields/SelectField";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = [
  { value: "draft", label: "Rascunho" },
  { value: "active", label: "Ativo" },
  { value: "done", label: "Concluído" },
];

const STATUS_VALIDACAO_OPTIONS = [
  { value: "draft", label: "Rascunho" },
  { value: "testing", label: "Em teste" },
  { value: "validated", label: "Validado" },
];

export interface OfertaFormProps {
  defaultValues: Partial<OfertaContent>;
}

/**
 * Form compartilhado por /direcao/oferta e /validacao/oferta — implementado
 * uma única vez, ambas as rotas renderizam o mesmo OfertaPage (§2 do SPEC).
 */
export function OfertaForm({ defaultValues }: OfertaFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.input<typeof ofertaSchema>, unknown, OfertaContent>({
    resolver: zodResolver(ofertaSchema),
    defaultValues: {
      title: "Oferta",
      status: "draft",
      nome_oferta: "",
      formato: "",
      preco: "",
      promessa: "",
      garantias: "",
      status_validacao: "draft",
      aprendizados: "",
      ...defaultValues,
    },
  });
  // As field primitives em components/forms/fields/ tipam `control` como
  // `Control<any>` (contrato fixo, não editável aqui). O RHF 7.81 gera um
  // mismatch estrutural estrito ao atribuir um Control fortemente tipado a
  // essa assinatura (ver props.name em ValidateForm); cast local e explícito
  // é o contorno mínimo, sem alterar as primitivas compartilhadas.
  const control = form.control as Control<any>;

  function onSubmit(values: OfertaContent) {
    startTransition(async () => {
      const result = await saveContentAction("oferta", values);
      if (!result.ok && result.errors) {
        for (const [field, message] of Object.entries(result.errors)) {
          form.setError(field as keyof OfertaContent, { message });
        }
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <TextField control={control} name="nome_oferta" label="Nome da oferta" />
      <TextField control={control} name="formato" label="Formato" />
      <TextField control={control} name="preco" label="Preço" />
      <TextareaField control={control} name="promessa" label="Promessa" />
      <TextareaField control={control} name="garantias" label="Garantias" />
      <SelectField
        control={control}
        name="status_validacao"
        label="Status de validação"
        options={STATUS_VALIDACAO_OPTIONS}
      />
      <MarkdownBodyField control={control} name="aprendizados" label="Aprendizados" />
      <SelectField control={control} name="status" label="Status" options={STATUS_OPTIONS} />
      <Button type="submit" disabled={isPending}>
        Salvar
      </Button>
    </form>
  );
}
