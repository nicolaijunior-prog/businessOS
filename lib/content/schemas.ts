// lib/content/schemas.ts
import { z, type ZodTypeAny } from "zod";

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

// ── Mapa de schemas por content id ──────────────────────────────────
export const contentSchemas = {
  "objetivo": objetivoSchema,
  "estilo-de-vida": estiloDeVidaSchema,
  "mapa-do-mercado": mapaDoMercadoSchema,
  "mapa-e-ima-de-problemas": mapaEImaDeProblemasSchema,
  "perfil-ideal-de-cliente": perfilIdealDeClienteSchema,
  "tese-de-valor": teseDeValorSchema,
  "oferta": ofertaSchema,
  "primeiros-passos": primeirosPassosSchema,
  "fluxo-de-caixa": fluxoDeCaixaSchema,
  "erp": erpSchema,
} as const satisfies Record<string, ZodTypeAny>;

export type Slug = keyof typeof contentSchemas;
