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
