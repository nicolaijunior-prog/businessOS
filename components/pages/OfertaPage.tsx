import { readContent } from "@/lib/content/read";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContentCard } from "@/components/content/ContentCard";
import { OfertaForm } from "@/components/forms/OfertaForm";
import type { OfertaContent } from "@/lib/content/types";

/**
 * Componente de composição único e compartilhado por /direcao/oferta e
 * /validacao/oferta (§2 do SPEC). Lê pelo content id "oferta" — nunca por
 * params de rota — e é importado por dois wrappers finos de rota.
 */
export default async function OfertaPage() {
  const { frontmatter, body, valid } = await readContent<OfertaContent>("oferta");

  return (
    <>
      <PageHeader title="Oferta" description="A oferta atual: formato, preço, promessa e garantias." />
      {!valid && (
        <p className="pb-4 text-sm text-destructive">
          O arquivo de conteúdo tem um formato inválido. Salvar corrige o arquivo.
        </p>
      )}
      <ContentCard>
        <OfertaForm defaultValues={{ ...frontmatter, aprendizados: body }} />
      </ContentCard>
    </>
  );
}
