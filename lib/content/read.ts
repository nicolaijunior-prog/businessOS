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

/**
 * Helper para checar se o arquivo de conteúdo de `slug` já existe em disco,
 * sem precisar ler/parsear seu conteúdo. Útil para código (ex.: outros
 * agentes/páginas ainda em construção) que precisa saber, antes de chamar
 * `readContent`, se o arquivo já foi criado.
 */
export async function contentFileExists(slug: ContentSlug): Promise<boolean> {
  const entry = CONTENT_REGISTRY[slug];
  const filePath = path.join(process.cwd(), entry.path);
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
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
