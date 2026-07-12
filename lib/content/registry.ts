// lib/content/registry.ts
import type { ZodTypeAny } from "zod";
import {
  objetivoSchema,
  estiloDeVidaSchema,
  mapaDoMercadoSchema,
  mapaEImaDeProblemasSchema,
  perfilIdealDeClienteSchema,
  teseDeValorSchema,
  ofertaSchema,
  primeirosPassosSchema,
  fluxoDeCaixaSchema,
  erpSchema,
} from "./schemas";

export interface ContentRegistryEntry {
  /** Caminho relativo à raiz do projeto. */
  path: string;
  /** Schema zod completo da página (base + campos específicos). */
  schema: ZodTypeAny;
  /**
   * Nome do campo do schema cujo valor é armazenado como CORPO Markdown
   * do arquivo (abaixo do frontmatter), em vez de como chave de frontmatter.
   * `null` quando a página não tem campo de corpo markdown.
   */
  bodyField: string | null;
}

export const CONTENT_REGISTRY = {
  "objetivo": {
    path: "content/founder/objetivo.md",
    schema: objetivoSchema,
    bodyField: "motivacao",
  },
  "estilo-de-vida": {
    path: "content/founder/estilo-de-vida.md",
    schema: estiloDeVidaSchema,
    bodyField: null,
  },
  "mapa-do-mercado": {
    path: "content/direcao/mapa-do-mercado.md",
    schema: mapaDoMercadoSchema,
    bodyField: "tendencias",
  },
  "mapa-e-ima-de-problemas": {
    path: "content/direcao/mapa-e-ima-de-problemas.md",
    schema: mapaEImaDeProblemasSchema,
    bodyField: null,
  },
  "perfil-ideal-de-cliente": {
    path: "content/direcao/perfil-ideal-de-cliente.md",
    schema: perfilIdealDeClienteSchema,
    bodyField: "descricao",
  },
  "tese-de-valor": {
    path: "content/direcao/tese-de-valor.md",
    schema: teseDeValorSchema,
    bodyField: "proposta_valor",
  },
  "oferta": {
    path: "content/direcao/oferta.md",
    schema: ofertaSchema,
    bodyField: "aprendizados",
  },
  "primeiros-passos": {
    path: "content/validacao/primeiros-passos.md",
    schema: primeirosPassosSchema,
    bodyField: null,
  },
  "fluxo-de-caixa": {
    path: "content/caixa/fluxo-de-caixa.md",
    schema: fluxoDeCaixaSchema,
    bodyField: "notas",
  },
  "erp": {
    path: "content/caixa/erp.md",
    schema: erpSchema,
    bodyField: "notas",
  },
} as const satisfies Record<string, ContentRegistryEntry>;

export type ContentSlug = keyof typeof CONTENT_REGISTRY;
