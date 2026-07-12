"use client";

import type { ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, type Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/content/ContentCard";
import { CardGrid } from "@/components/content/CardGrid";
import { CardList } from "@/components/content/CardList";

export interface RepeatableListFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  /** Nome do campo array no schema/form (ex.: "concorrentes", "problemas", "passos"). */
  name: string;
  label: string;
  /** Retorna os campos editáveis daquele item (montados com as demais primitivas). */
  renderItem: (index: number) => ReactNode;
  /** Valor default do novo item ao clicar "Adicionar" (objeto ou string). */
  newItem: unknown;
  /** "grid" | "list" — normalmente vindo de useViewMode().mode. */
  layout: "grid" | "list";
  emptyMessage?: string;
  addLabel?: string;
}

/**
 * Primitiva genérica para editar arrays de objetos (ou strings) via
 * useFieldArray do react-hook-form. Cada item do array é renderizado dentro
 * de um ContentCard (com botão de remover); o conjunto de Cards é envolvido
 * em CardGrid ou CardList conforme `layout` (§10.1 do SPEC).
 */
export function RepeatableListField({
  control,
  name,
  label,
  renderItem,
  newItem,
  layout,
  emptyMessage = "Nenhum item adicionado ainda.",
  addLabel = "Adicionar",
}: RepeatableListFieldProps) {
  const { fields, append, remove } = useFieldArray({ control, name });
  const Layout = layout === "grid" ? CardGrid : CardList;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium text-foreground">{label}</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(newItem as never)}
        >
          <Plus className="size-4" />
          {addLabel}
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <Layout>
          {fields.map((field, index) => (
            <ContentCard
              key={field.id}
              actions={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remover item"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              }
            >
              {renderItem(index)}
            </ContentCard>
          ))}
        </Layout>
      )}
    </div>
  );
}
