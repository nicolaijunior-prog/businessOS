import { readContent } from "@/lib/content/read";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContentCard } from "@/components/content/ContentCard";
import { EstiloDeVidaForm } from "@/components/forms/EstiloDeVidaForm";
import type { EstiloDeVidaContent } from "@/lib/content/types";

export default async function EstiloDeVidaPage() {
  const { frontmatter, valid } = await readContent<EstiloDeVidaContent>("estilo-de-vida");

  return (
    <>
      <PageHeader
        title="Estilo de Vida"
        description="A rotina e a renda que o negócio precisa sustentar."
      />
      {!valid && (
        <p className="text-sm text-destructive">
          O arquivo de conteúdo tem um formato inválido. Salvar corrige o arquivo.
        </p>
      )}
      <ContentCard>
        <EstiloDeVidaForm defaultValues={frontmatter} />
      </ContentCard>
    </>
  );
}
