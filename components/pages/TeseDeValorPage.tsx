import { readContent } from "@/lib/content/read";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContentCard } from "@/components/content/ContentCard";
import { TeseDeValorForm } from "@/components/forms/TeseDeValorForm";
import type { TeseDeValorContent } from "@/lib/content/types";

export default async function TeseDeValorPage() {
  const { frontmatter, body, valid } = await readContent<TeseDeValorContent>("tese-de-valor");

  return (
    <>
      <PageHeader
        title="Tese de Valor"
        description="Proposta de valor, diferenciação e hipóteses centrais do negócio."
      />
      {!valid && (
        <p className="pb-4 text-sm text-destructive">
          O arquivo de conteúdo tem um formato inválido. Salvar corrige o arquivo.
        </p>
      )}
      <ContentCard>
        <TeseDeValorForm defaultValues={{ ...frontmatter, proposta_valor: body }} />
      </ContentCard>
    </>
  );
}
