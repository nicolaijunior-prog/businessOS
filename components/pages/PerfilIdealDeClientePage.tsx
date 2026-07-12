import { readContent } from "@/lib/content/read";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContentCard } from "@/components/content/ContentCard";
import { PerfilIdealDeClienteForm } from "@/components/forms/PerfilIdealDeClienteForm";
import type { PerfilIdealDeClienteContent } from "@/lib/content/types";

export default async function PerfilIdealDeClientePage() {
  const { frontmatter, body, valid } = await readContent<PerfilIdealDeClienteContent>(
    "perfil-ideal-de-cliente"
  );

  return (
    <>
      <PageHeader
        title="Perfil Ideal de Cliente"
        description="Quem é o cliente ideal, suas dores, objetivos e onde encontrá-lo."
      />
      {!valid && (
        <p className="pb-4 text-sm text-destructive">
          O arquivo de conteúdo tem um formato inválido. Salvar corrige o arquivo.
        </p>
      )}
      <ContentCard>
        <PerfilIdealDeClienteForm defaultValues={{ ...frontmatter, descricao: body }} />
      </ContentCard>
    </>
  );
}
