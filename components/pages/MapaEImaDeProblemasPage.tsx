import { readContent } from "@/lib/content/read";
import { PageHeader } from "@/components/layout/PageHeader";
import { MapaEImaDeProblemasForm } from "@/components/forms/MapaEImaDeProblemasForm";
import { Badge } from "@/components/ui/badge";
import type { MapaEImaDeProblemasContent } from "@/lib/content/types";

export default async function MapaEImaDeProblemasPage() {
  const { frontmatter, valid } = await readContent<MapaEImaDeProblemasContent>(
    "mapa-e-ima-de-problemas"
  );

  const problemas = frontmatter.problemas ?? [];
  const coreId = frontmatter.problema_core_id ?? "";
  // Integridade referencial de problema_core_id é responsabilidade da UI (§11
  // do SPEC) — nunca do schema. Uma referência órfã vira um aviso visível.
  const hasOrphanCoreRef = Boolean(coreId) && !problemas.some((problema) => problema.id === coreId);

  return (
    <>
      <PageHeader
        title="Mapa e Ímã de Problemas"
        description="Problemas identificados e qual deles é o problema-ímã (core)."
      />
      {!valid && (
        <p className="pb-4 text-sm text-destructive">
          O arquivo de conteúdo tem um formato inválido. Salvar corrige o arquivo.
        </p>
      )}
      {hasOrphanCoreRef && (
        <div className="pb-4">
          <Badge variant="destructive">
            Referência quebrada: o problema-ímã selecionado (&quot;{coreId}&quot;) não existe mais na
            lista de problemas.
          </Badge>
        </div>
      )}
      <MapaEImaDeProblemasForm defaultValues={frontmatter} />
    </>
  );
}
