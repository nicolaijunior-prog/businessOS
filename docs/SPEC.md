# BusinessOS — SPEC.md (Contrato Técnico Congelado)

> **Status: CONGELADO.** Este documento é o contrato técnico que agentes de implementação seguem para construir o BusinessOS **em paralelo, sem conflitar entre si**. Onde este documento define um nome de arquivo, um nome de campo, uma assinatura de função ou uma estrutura de pastas, esse é o nome/estrutura a usar — não um exemplo. Não redesenhe decisões aqui tomadas; se um requisito parecer incompleto, siga a decisão mais próxima já registrada neste arquivo e, se necessário, registre a extensão na seção 15 (Decisões e Deltas), não a critério de cada agente.
>
> Este documento pressupõe `docs/BRIEFING.md` (produto, princípios visuais, por que Markdown) e `docs/PRD.md` (arquitetura de informação, páginas, requisitos funcionais) como já lidos. Onde este SPEC diverge do PRD em um detalhe técnico (há um caso: o slug de "Mapa e Ímã de Problemas", ver §15), **este SPEC prevalece**, pois é o contrato mais recente e mais específico.

---

## 0. Stack e dependências

- **Framework:** Next.js (App Router) + TypeScript, sempre.
- **UI:** shadcn/ui, `style: "new-york"`, `baseColor: "neutral"`, `cssVariables: true`.
- **Fonte:** Inter via `next/font/google`.
- **Formulários:** `react-hook-form` + `@hookform/resolvers/zod`.
- **Validação/Schema:** `zod`.
- **Frontmatter:** `gray-matter`.
- **Ícones:** `lucide-react` (padrão shadcn).
- **Utilitário de classes:** `clsx` + `tailwind-merge` via helper `cn()` em `lib/utils.ts` (padrão shadcn).
- **Documentação de componentes:** Storybook — todo componente em `components/ui`, `components/layout`, `components/content` e `components/forms/fields` deve ter um `*.stories.tsx` colocado ao lado do componente (fora do escopo detalhado deste SPEC, mas obrigatório por RNF8 do PRD).
- **Sem banco de dados.** Sem ORM. Sem camada de API HTTP entre UI e arquivo além do necessário para parsear/serializar frontmatter (RNF1 do PRD).

Pacotes npm mínimos a instalar: `next react react-dom typescript zod gray-matter react-hook-form @hookform/resolvers lucide-react clsx tailwind-merge tailwindcss class-variance-authority` + os componentes shadcn listados em §9.1.

---

## 1. Estrutura de pastas — visão geral do repositório

```
BusinessOS/
├── content/                          ← FONTE DA VERDADE (dados de negócio, .md + frontmatter)
│   ├── founder/
│   │   ├── objetivo.md
│   │   └── estilo-de-vida.md
│   ├── direcao/
│   │   ├── mapa-do-mercado.md
│   │   ├── mapa-e-ima-de-problemas.md
│   │   ├── perfil-ideal-de-cliente.md
│   │   ├── tese-de-valor.md
│   │   └── oferta.md
│   ├── validacao/
│   │   └── primeiros-passos.md
│   └── caixa/
│       ├── fluxo-de-caixa.md
│       └── erp.md
├── app/
│   ├── layout.tsx
│   ├── page.tsx                      ← redirect para /founder/objetivo
│   ├── founder/
│   │   ├── objetivo/page.tsx
│   │   └── estilo-de-vida/page.tsx
│   ├── direcao/
│   │   ├── mapa-do-mercado/page.tsx
│   │   ├── mapa-e-ima-de-problemas/page.tsx
│   │   ├── perfil-ideal-de-cliente/page.tsx
│   │   ├── tese-de-valor/page.tsx
│   │   └── oferta/page.tsx
│   ├── validacao/
│   │   ├── oferta/page.tsx
│   │   └── primeiros-passos/page.tsx
│   └── caixa/
│       ├── fluxo-de-caixa/page.tsx
│       └── erp/page.tsx
├── components/
│   ├── ui/                           ← shadcn (button, input, textarea, select, card, label, form, badge, ...)
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SidebarItem.tsx
│   │   └── PageHeader.tsx
│   ├── content/
│   │   ├── ContentCard.tsx
│   │   ├── CardGrid.tsx
│   │   ├── CardList.tsx
│   │   ├── ViewToggle.tsx
│   │   └── ViewModeProvider.tsx
│   ├── forms/
│   │   ├── fields/
│   │   │   ├── TextField.tsx
│   │   │   ├── TextareaField.tsx
│   │   │   ├── MarkdownBodyField.tsx
│   │   │   ├── SelectField.tsx
│   │   │   └── RepeatableListField.tsx
│   │   ├── ObjetivoForm.tsx
│   │   ├── EstiloDeVidaForm.tsx
│   │   ├── MapaDoMercadoForm.tsx
│   │   ├── MapaEImaDeProblemasForm.tsx
│   │   ├── PerfilIdealDeClienteForm.tsx
│   │   ├── TeseDeValorForm.tsx
│   │   ├── OfertaForm.tsx
│   │   ├── PrimeirosPassosForm.tsx
│   │   ├── FluxoDeCaixaForm.tsx
│   │   └── ErpForm.tsx
│   └── pages/
│       ├── ObjetivoPage.tsx
│       ├── EstiloDeVidaPage.tsx
│       ├── MapaDoMercadoPage.tsx
│       ├── MapaEImaDeProblemasPage.tsx
│       ├── PerfilIdealDeClientePage.tsx
│       ├── TeseDeValorPage.tsx
│       ├── OfertaPage.tsx
│       ├── PrimeirosPassosPage.tsx
│       ├── FluxoDeCaixaPage.tsx
│       └── ErpPage.tsx
└── lib/
    ├── utils.ts                      ← cn()
    ├── nav-config.ts
    └── content/
        ├── registry.ts
        ├── schemas.ts
        ├── types.ts
        ├── read.ts
        ├── write.ts
        └── actions.ts
```

**Regra de slug (obrigatória):** slugs de arquivo de conteúdo e de segmento de rota são **ASCII minúsculo com hífen, sem acento**. Títulos acentuados/com maiúscula ficam **apenas** no campo `title` do frontmatter, nunca no nome do arquivo ou da rota. Exemplo vinculante: a página "Mapa e Ímã de Problemas" usa o arquivo **`content/direcao/mapa-e-ima-de-problemas.md`** e a rota **`/direcao/mapa-e-ima-de-problemas`** — não `mapa-de-problemas` (ver §15, delta em relação ao PRD).

---

## 2. Content ID vs. rota: desacoplamento (caso Oferta)

- Cada página de conteúdo tem um **content id** único e estável (uma string curta, ex.: `"oferta"`, `"objetivo"`, `"fluxo-de-caixa"`). O content id é a chave em `lib/content/registry.ts` e é o que `read.ts`/`write.ts`/`actions.ts` usam — **nunca** o path da URL.
- `lib/nav-config.ts` define as 4 seções da sidebar e, para cada item, um `href` (rota) e um `contentId`. O content id **"oferta"** aparece em dois itens de navegação: um em Direção (`href: "/direcao/oferta"`), um em Validação (`href: "/validacao/oferta"`), ambos com `contentId: "oferta"`.
- Existe **um único arquivo** de dados: `content/direcao/oferta.md`. Não existe e não deve ser criado `content/validacao/oferta.md`.
- Porque o App Router do Next.js exige um segmento físico de arquivo por URL, existem **dois arquivos de rota**: `app/direcao/oferta/page.tsx` e `app/validacao/oferta/page.tsx`. Ambos são **wrappers finos** — nenhuma lógica além de renderizar o mesmo componente de composição `components/pages/OfertaPage.tsx`. `OfertaPage.tsx` chama `readContent("oferta")` (pelo content id, nunca lendo `params` de rota para decidir qual arquivo abrir).
- Qualquer novo campo, comportamento ou correção na página Oferta é implementado **uma vez** em `OfertaPage.tsx` / `OfertaForm.tsx` / `schemas.ts["oferta"]`. Os dois `page.tsx` nunca divergem em conteúdo além do import.

Wrapper de rota — conteúdo **idêntico** em ambos os arquivos, mudando apenas o path físico:

```tsx
// app/direcao/oferta/page.tsx
// app/validacao/oferta/page.tsx  (arquivo idêntico)
export const dynamic = "force-dynamic";

import OfertaPage from "@/components/pages/OfertaPage";

export default function Page() {
  return <OfertaPage />;
}
```

---

## 3. `lib/content/registry.ts` — mapa slug → arquivo → schema

O registry é a única fonte de verdade sobre "quais páginas de conteúdo existem, onde está o arquivo, qual schema valida, e qual campo é o corpo Markdown". `read.ts`, `write.ts` e `actions.ts` são genéricos por cima deste registry — **nenhum caminho de arquivo é hardcoded fora dele**.

```ts
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
```

10 entradas, 10 arquivos únicos — consistente com o PRD §3.1 (10 páginas de conteúdo, 11 entradas de navegação).

---

## 4. `lib/content/schemas.ts` — schemas zod

Regra fixa: **um `baseFrontmatterSchema`**, estendido (`.extend()`) por página com os campos específicos da tabela do PRD §4 (reproduzida no BRIEFING/tarefa). Os tipos TypeScript de cada página são **sempre** `z.infer<typeof schema>` em `types.ts` — nunca uma interface escrita à mão em paralelo ao schema.

```ts
// lib/content/schemas.ts
import { z } from "zod";

// ── Base ─────────────────────────────────────────────────────────────
export const baseFrontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().optional(),
  status: z.enum(["draft", "active", "done"]).default("draft"),
  updatedAt: z.string().datetime(),
});

// ── FOUNDER ──────────────────────────────────────────────────────────
export const objetivoSchema = baseFrontmatterSchema.extend({
  objetivo_principal: z.string().min(1),
  horizonte_tempo: z.string().optional().default(""),
  metricas_sucesso: z.string().optional().default(""),
  motivacao: z.string().optional().default(""), // corpo markdown
});

export const estiloDeVidaSchema = baseFrontmatterSchema.extend({
  rotina_desejada: z.string().optional().default(""),
  renda_alvo: z.string().optional().default(""),
  horas_por_semana: z.string().optional().default(""),
  flexibilidade_localizacao: z.string().optional().default(""),
});

// ── DIREÇÃO ──────────────────────────────────────────────────────────
const concorrenteSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().optional().default(""),
});

export const mapaDoMercadoSchema = baseFrontmatterSchema.extend({
  tamanho_mercado: z.string().optional().default(""),
  segmentos: z.array(z.string()).optional().default([]),
  concorrentes: z.array(concorrenteSchema).optional().default([]),
  tendencias: z.string().optional().default(""), // corpo markdown
});

const problemaSchema = z.object({
  id: z.string().min(1),
  titulo: z.string().min(1),
  descricao: z.string().optional().default(""),
  evidencia: z.string().optional().default(""),
});

export const mapaEImaDeProblemasSchema = baseFrontmatterSchema.extend({
  problemas: z.array(problemaSchema).optional().default([]),
  problema_core_id: z.string().optional().default(""),
});
// Integridade referencial de `problema_core_id` (deve existir em `problemas[]`) é
// responsabilidade da UI (select populado dinamicamente, ver §11 e RF3.8 do PRD),
// NÃO do schema. O schema valida apenas forma/tipo — nunca lança erro por uma
// referência órfã, para não violar a resiliência exigida em RNF6 do PRD.

export const perfilIdealDeClienteSchema = baseFrontmatterSchema.extend({
  descricao: z.string().optional().default(""), // corpo markdown
  dores: z.array(z.string()).optional().default([]),
  objetivos: z.array(z.string()).optional().default([]),
  onde_encontrar: z.string().optional().default(""),
  criterios_qualificacao: z.string().optional().default(""),
});

export const teseDeValorSchema = baseFrontmatterSchema.extend({
  proposta_valor: z.string().optional().default(""), // corpo markdown
  diferenciacao: z.string().optional().default(""),
  hipoteses_centrais: z.array(z.string()).optional().default([]),
});

export const ofertaSchema = baseFrontmatterSchema.extend({
  nome_oferta: z.string().min(1),
  formato: z.string().optional().default(""),
  preco: z.string().optional().default(""),
  promessa: z.string().optional().default(""),
  garantias: z.string().optional().default(""),
  status_validacao: z.enum(["draft", "testing", "validated"]).default("draft"),
  aprendizados: z.string().optional().default(""), // corpo markdown
});

// ── VALIDAÇÃO ────────────────────────────────────────────────────────
// Oferta reutiliza ofertaSchema acima — NÃO existe um segundo schema de Oferta.

const passoStatusEnum = z.enum(["todo", "em-andamento", "concluido", "bloqueado"]);

const passoSchema = z.object({
  id: z.string().min(1),
  descricao: z.string().min(1),
  prazo: z.string().optional().default(""),
  responsavel: z.string().optional().default(""),
  status: passoStatusEnum.default("todo"),
});

export const primeirosPassosSchema = baseFrontmatterSchema.extend({
  passos: z.array(passoSchema).optional().default([]),
});

// ── CAIXA ────────────────────────────────────────────────────────────
export const fluxoDeCaixaSchema = baseFrontmatterSchema.extend({
  mes_referencia: z.string().min(1), // ex.: "2026-07"
  entradas: z.coerce.number().optional().default(0),
  saidas: z.coerce.number().optional().default(0),
  saldo: z.coerce.number().optional().default(0),
  notas: z.string().optional().default(""), // corpo markdown
});

export const erpSchema = baseFrontmatterSchema.extend({
  erp_atual: z.string().optional().default(""),
  status_integracao: z
    .enum(["nao-iniciado", "em-andamento", "concluido"])
    .default("nao-iniciado"),
  notas: z.string().optional().default(""), // corpo markdown
});
```

`lib/content/types.ts` — apenas re-exportações `z.infer`, nunca tipos escritos à mão:

```ts
// lib/content/types.ts
import { z } from "zod";
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

export type ObjetivoContent = z.infer<typeof objetivoSchema>;
export type EstiloDeVidaContent = z.infer<typeof estiloDeVidaSchema>;
export type MapaDoMercadoContent = z.infer<typeof mapaDoMercadoSchema>;
export type MapaEImaDeProblemasContent = z.infer<typeof mapaEImaDeProblemasSchema>;
export type PerfilIdealDeClienteContent = z.infer<typeof perfilIdealDeClienteSchema>;
export type TeseDeValorContent = z.infer<typeof teseDeValorSchema>;
export type OfertaContent = z.infer<typeof ofertaSchema>;
export type PrimeirosPassosContent = z.infer<typeof primeirosPassosSchema>;
export type FluxoDeCaixaContent = z.infer<typeof fluxoDeCaixaSchema>;
export type ErpContent = z.infer<typeof erpSchema>;
```

**Campos base expostos na UI (decisão):** de `baseFrontmatterSchema`, apenas `status` é editável em cada formulário (via `SelectField`, ver §12). `title` é preenchido automaticamente pelo form com o label fixo da página vindo de `lib/nav-config.ts` (ex.: `"Objetivo"`, `"Oferta"`) — nunca um input livre. `summary` existe no schema para uso futuro mas **não** é exposto em nenhum form da v1. `updatedAt` **nunca** é editável pelo usuário — é sempre sobrescrito no servidor em `writeContent`/`saveContentAction` (§5) com `new Date().toISOString()`.

---

## 5. `lib/content/read.ts`, `write.ts`, `actions.ts`

### 5.1 Contrato de leitura

```ts
// lib/content/read.ts
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { CONTENT_REGISTRY, type ContentSlug } from "./registry";

export interface ContentReadResult<T = Record<string, unknown>> {
  /** Frontmatter tipado (bodyField já removido daqui, se houver). */
  frontmatter: Partial<T>;
  /** Corpo markdown (vazio se a página não tem bodyField, ou se o arquivo não existe). */
  body: string;
  /** false se o arquivo ainda não existe em disco. */
  exists: boolean;
  /** false se o arquivo existe mas falhou na validação zod (frontmatter malformado). */
  valid: boolean;
}

export async function readContent<T = Record<string, unknown>>(
  slug: ContentSlug
): Promise<ContentReadResult<T>> {
  const entry = CONTENT_REGISTRY[slug];
  const filePath = path.join(process.cwd(), entry.path);

  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf-8");
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      // RF2.2: arquivo ausente não é erro — página renderiza formulário vazio.
      return { frontmatter: {}, body: "", exists: false, valid: true };
    }
    throw err;
  }

  const { data, content } = matter(raw);
  const merged = entry.bodyField ? { ...data, [entry.bodyField]: content.trim() } : data;

  const parsed = entry.schema.safeParse(merged);
  if (!parsed.success) {
    // RNF6: nunca lançar. Devolve os dados brutos para a UI degradar com aviso.
    return { frontmatter: merged as Partial<T>, body: content, exists: true, valid: false };
  }

  const parsedData = parsed.data as Record<string, unknown>;
  const { [entry.bodyField ?? ""]: bodyValue, ...frontmatterOnly } = parsedData;

  return {
    frontmatter: (entry.bodyField ? frontmatterOnly : parsedData) as Partial<T>,
    body: entry.bodyField ? String(bodyValue ?? "") : "",
    exists: true,
    valid: true,
  };
}
```

### 5.2 Contrato de escrita

```ts
// lib/content/write.ts
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { CONTENT_REGISTRY, type ContentSlug } from "./registry";

/**
 * `input` já deve ter passado por `schema.parse()` (feito em actions.ts) antes
 * de chegar aqui. writeContent não revalida — apenas serializa e grava.
 */
export async function writeContent(
  slug: ContentSlug,
  parsedInput: Record<string, unknown>
): Promise<void> {
  const entry = CONTENT_REGISTRY[slug];
  const filePath = path.join(process.cwd(), entry.path);

  const body = entry.bodyField ? String(parsedInput[entry.bodyField] ?? "") : "";
  const frontmatterData = entry.bodyField
    ? Object.fromEntries(
        Object.entries(parsedInput).filter(([key]) => key !== entry.bodyField)
      )
    : parsedInput;

  const fileContents = matter.stringify(body, frontmatterData);

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tmpPath = `${filePath}.tmp`;
  await fs.writeFile(tmpPath, fileContents, "utf-8");
  await fs.rename(tmpPath, filePath); // escrita atômica
}
```

### 5.3 Server Action genérica

```ts
// lib/content/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { CONTENT_REGISTRY, type ContentSlug } from "./registry";
import { writeContent } from "./write";

export interface SaveContentResult {
  ok: boolean;
  errors?: Record<string, string>;
}

export async function saveContentAction(
  slug: ContentSlug,
  data: Record<string, unknown>
): Promise<SaveContentResult> {
  const entry = CONTENT_REGISTRY[slug];

  const parsed = entry.schema.safeParse({
    ...data,
    updatedAt: new Date().toISOString(), // servidor sempre sobrescreve
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, errors };
  }

  await writeContent(slug, parsed.data as Record<string, unknown>);
  revalidatePath("/", "layout"); // abordagem ampla e simples — não path por rota
  return { ok: true };
}
```

**Regra fixa:** esta é a **única** Server Action de escrita de conteúdo do projeto. Nenhum form chama `fs` diretamente nem implementa sua própria escrita — todos chamam `saveContentAction(slug, data)`.

**Regra fixa (sem cache em memória):** todo `page.tsx` de conteúdo declara `export const dynamic = "force-dynamic"` e chama `readContent()` a cada request. Nenhum componente de servidor cacheia resultado de leitura entre requests (nem `unstable_cache`, nem módulo-level singleton) — agentes de IA escrevem nos arquivos fora do ciclo de request do Next.js, então uma leitura obsoleta é um bug de produto, não um detalhe de performance.

---

## 6. `lib/nav-config.ts`

```ts
// lib/nav-config.ts
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
```

`Sidebar.tsx` renderiza `NAV_CONFIG` diretamente (4 seções, 11 links). `SidebarItem.tsx` usa `usePathname()` para comparar com `item.href` e aplicar o estado ativo (§10).

---

## 7. Componentes de layout

- **`AppShell.tsx`**: shell de página inteira — `Sidebar` fixa à esquerda + área de conteúdo à direita (`children`). Envolve `children` com `ViewModeProvider`. Usado em `app/layout.tsx`.
- **`Sidebar.tsx`**: recebe `NAV_CONFIG`, renderiza as 4 seções com título de seção e lista de `SidebarItem`.
- **`SidebarItem.tsx`**: props `{ label, href }`. Link do Next (`next/link`). Estilo em §10.
- **`PageHeader.tsx`**: props `{ title, description? }`. Cabeçalho simples no topo de cada página (título da página + descrição opcional), usado por todos os `components/pages/*Page.tsx`.

---

## 8. Componentes de conteúdo (`components/content/`)

- **`ViewModeProvider.tsx`**: Context React com `{ mode: "grid" | "list", setMode }`. Inicializa lendo `localStorage["businessos:view-mode"]` (fallback `"grid"`), persiste a cada mudança. Envolve toda a árvore em `AppShell` — é **global**, uma única preferência para todas as páginas com lista (RF4.2 do PRD).
- **`ViewToggle.tsx`**: usa o componente **`Select`** do shadcn (não segmented control — decisão explícita do produto), duas opções ("Grade" / "Lista"), lê/escreve `useViewMode()`. Só é renderizado pelas páginas com campo em lista (§11).
- **`ContentCard.tsx`**: wrapper de `components/ui/card.tsx` com props `{ title?, children, actions? }`. Usado tanto para o Card único de páginas de campo único quanto para cada item de lista em páginas de grid/lista.
- **`CardGrid.tsx`**: `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>`.
- **`CardList.tsx`**: `<div className="flex flex-col gap-3">{children}</div>`.

`CardGrid`/`CardList` não sabem nada sobre o conteúdo dos cards — apenas fazem o layout. Quem decide grid vs. lista é o `mode` de `useViewMode()`, lido pelo componente de página (§11).

---

## 9. Design tokens

### 9.1 shadcn / Tailwind

- `components.json`: `"style": "new-york"`, `"tailwind.baseColor": "neutral"`, `"tailwind.cssVariables": true`.
- Paleta **100% neutra/grayscale**: usar apenas as variáveis CSS geradas pelo shadcn (`--background`, `--foreground`, `--card`, `--card-foreground`, `--border`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, etc.) — nenhuma cor com matiz (hue) é adicionada em nenhum componente. Estados de erro/validação usam `--destructive` (já neutro/vermelho padrão do shadcn), sem paleta adicional.
- Componentes shadcn a instalar via CLI: `button`, `input`, `textarea`, `select`, `card`, `label`, `form`, `badge`, `separator`.
- **Raio único**: `--radius: 0.75rem` no CSS raiz. Todo componente que precisa de borda arredondada usa a classe utilitária `rounded-[--radius]` (ou os componentes shadcn padrão, que já herdam `--radius` nas variantes `sm`/`md`/`lg` derivadas dele) — não introduzir um segundo valor de raio em nenhum componente novo.

### 9.2 Tipografia

```ts
// app/layout.tsx (trecho)
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
```

`--font-sans` é referenciada no `tailwind.config.ts` (`fontFamily.sans = ["var(--font-sans)", ...defaultTheme.fontFamily.sans]`) e aplicada na tag `<html>`/`<body>` via `className={inter.variable}`. Nenhum outro componente define `font-family` diretamente.

### 9.3 Sidebar — hover e estado ativo

```tsx
// components/layout/SidebarItem.tsx (essência)
<Link
  href={href}
  className={cn(
    "flex items-center rounded-[--radius] px-3 py-2 text-sm transition-colors",
    "hover:bg-accent hover:text-accent-foreground",
    isActive && "bg-accent text-accent-foreground"
  )}
>
  {label}
</Link>
```

`isActive` = `usePathname() === href` (comparação exata de rota, não `startsWith`, para que "Oferta" fique ativo apenas na rota exata visitada).

---

## 10. Regra de exibição por página (Card único vs. Grid/Lista)

Direto da tabela de campos do PRD/tarefa:

| Página | Exibição | Campo-lista principal |
|---|---|---|
| Objetivo | Card único | — |
| Estilo de Vida | Card único | — |
| Mapa do Mercado | Grid/Lista + ViewToggle | `concorrentes` |
| Mapa e Ímã de Problemas | Grid/Lista + ViewToggle | `problemas` |
| Perfil Ideal de Cliente | Card único | — |
| Tese de Valor | Card único | — |
| Oferta | Card único | — |
| Primeiros Passos | Grid/Lista + ViewToggle | `passos` |
| Fluxo de Caixa | Card único | — |
| ERP | Card único | — |

### 10.1 Como Grid/Lista se relaciona com o formulário (decisão vinculante)

Não existe um "modo leitura" separado de um "modo edição" para as páginas de lista. Os Cards em Grid/Lista **são** o formulário:

- Nas 3 páginas com campo-lista, o form da página (`MapaDoMercadoForm`, `MapaEImaDeProblemasForm`, `PrimeirosPassosForm`) usa `RepeatableListField` (§12) para o campo-lista. `RepeatableListField`, quando usado nessas 3 páginas, renderiza **cada item do array dentro de um `ContentCard`** (com os campos daquele item editáveis inline + botão de remover), e envolve o conjunto de Cards em `CardGrid` ou `CardList` conforme `useViewMode().mode`.
- Campos escalares da mesma página que não fazem parte da lista (ex.: `tamanho_mercado`, `segmentos`, `tendencias` em Mapa do Mercado; `problema_core_id` em Mapa e Ímã de Problemas) aparecem em **um `ContentCard` de contexto no topo da página**, antes do `ViewToggle` e da grade de itens — consistente com o PRD §4.3.
- Salvar (um único botão "Salvar" no fim do form da página) persiste a página inteira — campos de contexto + lista — em uma única chamada a `saveContentAction`. Não há salvamento por item individual.
- Remover um item da lista (RF3.4 do PRD) é remover a entrada do array via `useFieldArray` do react-hook-form (dentro de `RepeatableListField`) e salvar a página — não há uma rota/ação de delete separada por item.

Páginas de Card único (Objetivo, Estilo de Vida, Perfil Ideal de Cliente, Tese de Valor, Oferta, Fluxo de Caixa, ERP) não usam `ViewToggle`, `CardGrid` nem `CardList`: `components/pages/*Page.tsx` renderiza um único `ContentCard` contendo o form inteiro daquela página.

---

## 11. `problema_core_id` — integridade referencial

- No schema (`mapaEImaDeProblemasSchema`), `problema_core_id` é apenas `z.string().optional()` — validação de forma, não de referência (§4).
- No `MapaEImaDeProblemasForm.tsx`, `problema_core_id` é renderizado com `SelectField`, cujas opções são geradas dinamicamente a partir do estado atual (via `watch`/`useFieldArray`) do array `problemas` do próprio form — o usuário nunca digita um id livre (satisfaz RF3.8 do PRD: só é possível selecionar entre ids existentes no momento da edição).
- `MapaEImaDeProblemasPage.tsx` (composição, não o form) é responsável por, no modo leitura/exibição dos Cards, checar se `frontmatter.problema_core_id` corresponde a algum `id` em `frontmatter.problemas` e, se não corresponder (referência órfã — por exemplo, o problema foi removido depois), exibir um aviso visível (ex.: `Badge` variant destructive "referência quebrada") em vez de falhar silenciosamente ou quebrar a página (RNF6).
- O Card do problema cujo `id === problema_core_id` recebe destaque visual (ex.: `Badge` "Core" ou borda diferenciada) nos dois modos (grid e lista).

---

## 12. Formulários (`components/forms/`)

**Decisão explícita:** não existe um renderizador genérico de JSON-schema. Cada página tem seu **próprio componente de formulário**, escrito à mão, montado a partir das primitivas de `components/forms/fields/`. Isso é intencional — 10 páginas para um único usuário não justificam um motor de formulários genérico.

### 12.1 Primitivas obrigatórias (`components/forms/fields/`)

Todas as primitivas envolvem os componentes `Form`/`FormField`/`FormItem`/`FormLabel`/`FormControl`/`FormMessage` do shadcn (que por sua vez usam o `Controller` do react-hook-form) e recebem `control` (do `useForm()` da página) + `name` + `label`:

- **`TextField.tsx`** — `{ control, name, label, placeholder? }` → `Input` de uma linha. Usado para todo campo `texto` da tabela do PRD (ex.: `objetivo_principal`, `tamanho_mercado`, `nome_oferta`, `mes_referencia`).
- **`TextareaField.tsx`** — `{ control, name, label, rows? }` → `Textarea`. Usado para campos de texto mais longos que não são o corpo markdown da página (ex.: `promessa`, `garantias`, `descricao` de concorrente).
- **`MarkdownBodyField.tsx`** — `{ control, name, label }` → `Textarea` de várias linhas (`rows={10}`+), mapeado ao campo indicado por `bodyField` no registry (ex.: `motivacao`, `tendencias`, `descricao`, `proposta_valor`, `aprendizados`, `notas`). Sem WYSIWYG — textarea simples, consistente com o BRIEFING (a UI é uma camada amigável sobre o arquivo, não um editor rich-text).
- **`SelectField.tsx`** — `{ control, name, label, options: {value, label}[] }` → `Select` do shadcn. Usado para todo campo enum: `status` (base), `status_validacao` (Oferta), `status_integracao` (ERP), `status` de cada passo (Primeiros Passos), e `problema_core_id` (Mapa e Ímã de Problemas, opções dinâmicas — §11).
- **`RepeatableListField.tsx`** — `{ control, name, label, renderItem, newItem, layout }` → usa `useFieldArray` do react-hook-form. `renderItem(index)` retorna os campos daquele item (montados com as primitivas acima). `newItem` é o objeto de valores default ao clicar "Adicionar". `layout: "grid" | "list"` vem de `useViewMode().mode` e decide se envolve os itens em `CardGrid` ou `CardList` (§10.1). Suporta tanto lista de strings simples (um `TextField` por item) quanto lista de objetos (`concorrentes`, `problemas`, `passos`).

### 12.2 Forms por página

Um arquivo por página em `components/forms/`, todos seguindo o mesmo esqueleto:

```tsx
// components/forms/ObjetivoForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { objetivoSchema } from "@/lib/content/schemas";
import type { ObjetivoContent } from "@/lib/content/types";
import { saveContentAction } from "@/lib/content/actions";
import { TextField } from "./fields/TextField";
import { MarkdownBodyField } from "./fields/MarkdownBodyField";
import { SelectField } from "./fields/SelectField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

const STATUS_OPTIONS = [
  { value: "draft", label: "Rascunho" },
  { value: "active", label: "Ativo" },
  { value: "done", label: "Concluído" },
];

export function ObjetivoForm({ defaultValues }: { defaultValues: Partial<ObjetivoContent> }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ObjetivoContent>({
    resolver: zodResolver(objetivoSchema),
    defaultValues: { title: "Objetivo", status: "draft", ...defaultValues },
  });

  function onSubmit(values: ObjetivoContent) {
    startTransition(async () => {
      const result = await saveContentAction("objetivo", values);
      if (!result.ok && result.errors) {
        for (const [field, message] of Object.entries(result.errors)) {
          form.setError(field as keyof ObjetivoContent, { message });
        }
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <TextField control={form.control} name="objetivo_principal" label="Objetivo principal" />
        <TextField control={form.control} name="horizonte_tempo" label="Horizonte de tempo" />
        <TextField control={form.control} name="metricas_sucesso" label="Métricas de sucesso" />
        <MarkdownBodyField control={form.control} name="motivacao" label="Motivação" />
        <SelectField control={form.control} name="status" label="Status" options={STATUS_OPTIONS} />
        <Button type="submit" disabled={isPending}>Salvar</Button>
      </form>
    </Form>
  );
}
```

Os outros 9 forms (`EstiloDeVidaForm`, `MapaDoMercadoForm`, `MapaEImaDeProblemasForm`, `PerfilIdealDeClienteForm`, `TeseDeValorForm`, `OfertaForm`, `PrimeirosPassosForm`, `FluxoDeCaixaForm`, `ErpForm`) seguem exatamente este esqueleto — `resolver: zodResolver(<schemaDaPagina>)`, `saveContentAction("<slug>", values)`, campos montados a partir das primitivas de §12.1 conforme a tabela de campos de cada página. Forms de página com campo-lista adicionam `RepeatableListField` para o array principal, dentro do mesmo `<form>` (§10.1) — não é um form separado.

### 12.3 Composição de página (`components/pages/`)

Cada `*Page.tsx` é um **server component** (pode ser `async`): chama `readContent(slug)`, trata os 3 estados (`!exists`, `!valid`, ok) e renderiza `PageHeader` + o Card/Cards + o form correspondente hidratado com `defaultValues`.

```tsx
// components/pages/ObjetivoPage.tsx
import { readContent } from "@/lib/content/read";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContentCard } from "@/components/content/ContentCard";
import { ObjetivoForm } from "@/components/forms/ObjetivoForm";
import type { ObjetivoContent } from "@/lib/content/types";

export default async function ObjetivoPage() {
  const { frontmatter, body, valid } = await readContent<ObjetivoContent>("objetivo");

  return (
    <>
      <PageHeader title="Objetivo" />
      {!valid && (
        <p className="text-sm text-destructive">
          O arquivo de conteúdo tem um formato inválido. Salvar corrige o arquivo.
        </p>
      )}
      <ContentCard>
        <ObjetivoForm defaultValues={{ ...frontmatter, motivacao: body }} />
      </ContentCard>
    </>
  );
}
```

`OfertaPage.tsx` segue o mesmo padrão, chamando `readContent("oferta")` — é o único componente de página importado por dois wrappers de rota (§2).

Páginas com campo-lista (`MapaDoMercadoPage`, `MapaEImaDeProblemasPage`, `PrimeirosPassosPage`) seguem o mesmo padrão, mas o form interno já inclui o `ViewToggle` + `RepeatableListField` conforme §10.1 — a página de composição não precisa saber de grid/lista, isso é interno ao form.

---

## 13. Rotas — `page.tsx` por página (fora do caso Oferta)

Todo `page.tsx` de conteúdo (exceto os dois wrappers de Oferta já mostrados em §2, que seguem o mesmo padrão) segue este esqueleto:

```tsx
// app/founder/objetivo/page.tsx
export const dynamic = "force-dynamic";

import ObjetivoPage from "@/components/pages/ObjetivoPage";

export default function Page() {
  return <ObjetivoPage />;
}
```

Trocar `ObjetivoPage` pelo componente correspondente em cada uma das 11 rotas listadas em §1. `app/page.tsx` (raiz) faz `redirect("/founder/objetivo")` do `next/navigation`.

---

## 14. Checklist de aceitação (por página, para verificação independente)

Para qualquer página `X`, a implementação está completa quando:

1. `lib/content/registry.ts` tem uma entrada para o content id de `X`, apontando para o path correto em `content/` e o schema correto.
2. `lib/content/schemas.ts` tem `<x>Schema = baseFrontmatterSchema.extend({...})` com exatamente os campos da tabela do PRD/tarefa para `X`, e `lib/content/types.ts` re-exporta `type <X>Content = z.infer<typeof <x>Schema>`.
3. `lib/nav-config.ts` tem uma (ou, só para Oferta, duas) entrada(s) apontando `contentId` para o content id de `X`.
4. Existe `app/<secao>/<slug>/page.tsx` com `export const dynamic = "force-dynamic"` renderizando `components/pages/<X>Page.tsx`.
5. `components/pages/<X>Page.tsx` chama `readContent("<slug>")`, trata `exists`/`valid`, e renderiza a exibição correta conforme §10 (Card único ou ViewToggle+Grid/Lista).
6. `components/forms/<X>Form.tsx` usa `useForm` com `zodResolver(<x>Schema)`, todos os campos da tabela mapeados às primitivas de §12.1, e chama `saveContentAction("<slug>", values)` no submit.
7. Se `X` tem campo-lista: `RepeatableListField` está presente, itens renderizam como `ContentCard` dentro de `CardGrid`/`CardList` conforme `useViewMode()`, e há botão de remoção por item.
8. Salvar em `X` e recarregar a rota reflete os dados persistidos em `content/<secao>/<slug>.md` (frontmatter YAML + corpo markdown, quando aplicável) — verificável abrindo o arquivo diretamente.
9. Para Oferta especificamente: salvar em `/direcao/oferta` e navegar para `/validacao/oferta` (ou vice-versa) mostra os dados atualizados, e existe apenas o arquivo `content/direcao/oferta.md` em disco (RF5.1 do PRD).

---

## 15. Decisões e deltas em relação ao PRD (registro explícito)

- **Slug de "Mapa e Ímã de Problemas":** o PRD (§3.1) listava a rota `/direcao/mapa-de-problemas` e o arquivo `content/direcao/mapa-de-problemas.md`. Este SPEC **substitui** essa decisão: o slug correto, vinculante, é `mapa-e-ima-de-problemas` (arquivo `content/direcao/mapa-e-ima-de-problemas.md`, rota `/direcao/mapa-e-ima-de-problemas`). Motivo: nome mais fiel ao título da página e explicitamente definido como contrato nesta tarefa.
- **Campos base expostos na UI:** o PRD não especifica se `title`/`summary`/`updatedAt` de `baseFrontmatterSchema` aparecem em formulário. Decisão deste SPEC (§4): `title` é automático (label da página), `summary` não é exposto na v1, `updatedAt` é sempre definido no servidor, apenas `status` é editável.
- **Relação Grid/Lista ↔ formulário:** o PRD não especifica se a exibição em Cards de páginas com lista é somente leitura ou é o próprio formulário. Decisão deste SPEC (§10.1): não há dois modos — os Cards em Grid/Lista são a superfície de edição inline dos itens do array, dentro do único form da página.
- **Integridade de `problema_core_id`:** o PRD (§4.4) pedia validação "no formulário" sem detalhar o nível (schema vs. UI). Decisão deste SPEC (§4, §11): validação de forma no zod (sem checar referência), integridade referencial e aviso de "referência quebrada" tratados na camada de UI/componente de página — para não violar RNF6 (resiliência a arquivo malformado) fazendo o `safeParse` falhar por causa de uma referência órfã.
- **Primitiva adicional `SelectField`:** a tarefa nomeou `TextField`, `TextareaField`, `MarkdownBodyField`, `RepeatableListField` como primitivas obrigatórias. Este SPEC adiciona `SelectField` como quinta primitiva obrigatória — necessária para todos os campos enum da tabela (`status`, `status_validacao`, `status_integracao`, `status` de passo, `problema_core_id`) e não representa um renderizador genérico (continua sendo uma primitiva de campo único, no mesmo espírito das demais).
