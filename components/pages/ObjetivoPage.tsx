import { readContent } from "@/lib/content/read";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContentCard } from "@/components/content/ContentCard";
import { ObjetivoForm } from "@/components/forms/ObjetivoForm";
import type { ObjetivoContent } from "@/lib/content/types";

export default async function ObjetivoPage() {
  const { frontmatter, body, valid } = await readContent<ObjetivoContent>("objetivo");

  return (
    <>
      <PageHeader
        title="Objetivo"
        description="Para onde este negócio está indo e por quê."
      />
      {!valid && (
        <p className="text-sm text-destructive">
          O arquivo de conteúdo tem um formato inválido. Salvar corrige o arquivo.
        </p>
      )}
      <ContentCard>
        <ObjetivoForm defaultValues={{ ...frontmatter, motivacao: body }} />
      </ContentCard>
    </>
  );
}
