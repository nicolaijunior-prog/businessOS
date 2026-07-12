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
