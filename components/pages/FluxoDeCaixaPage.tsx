import { readContent } from "@/lib/content/read";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContentCard } from "@/components/content/ContentCard";
import { FluxoDeCaixaForm } from "@/components/forms/FluxoDeCaixaForm";
import type { FluxoDeCaixaContent } from "@/lib/content/types";

export default async function FluxoDeCaixaPage() {
  const { frontmatter, body, valid } = await readContent<FluxoDeCaixaContent>("fluxo-de-caixa");

  return (
    <>
      <PageHeader
        title="Fluxo de Caixa"
        description="Snapshot mensal simples de entradas, saídas e saldo."
      />
      {!valid && (
        <p className="pb-4 text-sm text-destructive">
          O arquivo de conteúdo tem um formato inválido. Salvar corrige o arquivo.
        </p>
      )}
      <ContentCard>
        <FluxoDeCaixaForm defaultValues={{ ...frontmatter, notas: body }} />
      </ContentCard>
    </>
  );
}
