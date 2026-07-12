import type { ContentSlug } from "./content/registry";

export interface NavItem {
  label: string;
  href: string;
  contentId: ContentSlug;
}

export interface NavSection {
  id: "founder" | "direcao" | "validacao" | "caixa";
  label: string;
  items: NavItem[];
}

export const NAV_CONFIG: NavSection[] = [
  {
    id: "founder",
    label: "Founder",
    items: [
      { label: "Objetivo", href: "/founder/objetivo", contentId: "objetivo" },
      { label: "Estilo de Vida", href: "/founder/estilo-de-vida", contentId: "estilo-de-vida" },
    ],
  },
  {
    id: "direcao",
    label: "Direção",
    items: [
      { label: "Mapa do Mercado", href: "/direcao/mapa-do-mercado", contentId: "mapa-do-mercado" },
      {
        label: "Mapa e Ímã de Problemas",
        href: "/direcao/mapa-e-ima-de-problemas",
        contentId: "mapa-e-ima-de-problemas",
      },
      {
        label: "Perfil Ideal de Cliente",
        href: "/direcao/perfil-ideal-de-cliente",
        contentId: "perfil-ideal-de-cliente",
      },
      { label: "Tese de Valor", href: "/direcao/tese-de-valor", contentId: "tese-de-valor" },
      { label: "Oferta", href: "/direcao/oferta", contentId: "oferta" },
    ],
  },
  {
    id: "validacao",
    label: "Validação",
    items: [
      { label: "Oferta", href: "/validacao/oferta", contentId: "oferta" },
      {
        label: "Primeiros Passos",
        href: "/validacao/primeiros-passos",
        contentId: "primeiros-passos",
      },
    ],
  },
  {
    id: "caixa",
    label: "Caixa",
    items: [
      { label: "Fluxo de Caixa", href: "/caixa/fluxo-de-caixa", contentId: "fluxo-de-caixa" },
      { label: "ERP", href: "/caixa/erp", contentId: "erp" },
    ],
  },
];
