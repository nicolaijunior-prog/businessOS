import { readContent } from "@/lib/content/read";
import { PageHeader } from "@/components/layout/PageHeader";
import { PrimeirosPassosForm } from "@/components/forms/PrimeirosPassosForm";
import type { PrimeirosPassosContent } from "@/lib/content/types";

export default async function PrimeirosPassosPage() {
  const { frontmatter, valid } = await readContent<PrimeirosPassosContent>("primeiros-passos");

  return (
    <>
      <PageHeader
        title="Primeiros Passos"
        description="Passos de validação: o que fazer, prazo, responsável e status."
      />
      {!valid && (
        <p className="pb-4 text-sm text-destructive">
          O arquivo de conteúdo tem um formato inválido. Salvar corrige o arquivo.
        </p>
      )}
      <PrimeirosPassosForm defaultValues={frontmatter} />
    </>
  );
}
