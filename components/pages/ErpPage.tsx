import { readContent } from "@/lib/content/read";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContentCard } from "@/components/content/ContentCard";
import { ErpForm } from "@/components/forms/ErpForm";
import type { ErpContent } from "@/lib/content/types";

export default async function ErpPage() {
  const { frontmatter, body, valid } = await readContent<ErpContent>("erp");

  return (
    <>
      <PageHeader
        title="ERP"
        description="Ferramenta financeira atual e status da integração."
      />
      {!valid && (
        <p className="pb-4 text-sm text-destructive">
          O arquivo de conteúdo tem um formato inválido. Salvar corrige o arquivo.
        </p>
      )}
      <ContentCard>
        <ErpForm defaultValues={{ ...frontmatter, notas: body }} />
      </ContentCard>
    </>
  );
}
