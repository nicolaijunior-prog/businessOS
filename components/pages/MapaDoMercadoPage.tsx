import { readContent } from "@/lib/content/read";
import { PageHeader } from "@/components/layout/PageHeader";
import { MapaDoMercadoForm } from "@/components/forms/MapaDoMercadoForm";
import type { MapaDoMercadoContent } from "@/lib/content/types";

export default async function MapaDoMercadoPage() {
  const { frontmatter, body, valid } = await readContent<MapaDoMercadoContent>("mapa-do-mercado");

  return (
    <>
      <PageHeader
        title="Mapa do Mercado"
        description="Tamanho de mercado, segmentos, concorrentes e tendências."
      />
      {!valid && (
        <p className="pb-4 text-sm text-destructive">
          O arquivo de conteúdo tem um formato inválido. Salvar corrige o arquivo.
        </p>
      )}
      <MapaDoMercadoForm defaultValues={{ ...frontmatter, tendencias: body }} />
    </>
  );
}
