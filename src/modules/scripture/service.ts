import { z } from "zod";
import type { Result } from "@/modules/_shared/result";
import { err, ok } from "@/modules/_shared/result";
import type { AppError } from "@/modules/_shared/errors";
import { unexpected, validation } from "@/modules/_shared/errors";

export type ScriptureService = {
  lookup(input: { ref: string }): Promise<Result<{ reference: string; text: string; translationName: string }, AppError>>;
};

const schema = z.object({
  ref: z.string().min(1).max(160).transform((s) => s.trim()),
});

export function createScriptureService(): ScriptureService {
  return {
    async lookup(input) {
      const parsed = schema.safeParse(input);
      if (!parsed.success) return err(validation(parsed.error.issues[0]?.message ?? "Invalid reference"));

      // We intentionally keep the existing external provider (bible-api.com) behind this module boundary.
      const { ref } = parsed.data;
      const url = new URL("https://bible-api.com/");
      url.pathname = `/${encodeURIComponent(ref)}`;

      const translation = (process.env.BIBLE_API_TRANSLATION ?? "web").trim().toLowerCase();
      url.searchParams.set("translation", translation);

      try {
        const res = await fetch(url.toString(), {
          headers: { Accept: "application/json" },
          next: { revalidate: 86400 },
        });
        if (!res.ok) return err(unexpected("Passage not found"));

        const data = (await res.json()) as any;
        const reference = String(data.reference ?? ref);
        const translationName = String(data.translation_name ?? translation.toUpperCase());
        const text =
          typeof data.text === "string" && data.text.trim().length > 0
            ? data.text.trim()
            : Array.isArray(data.verses)
              ? data.verses.map((v: any) => String(v.text ?? "").trim()).filter(Boolean).join("\n\n")
              : "";

        return ok({
          reference,
          text: text || "No text returned for this reference.",
          translationName,
        });
      } catch {
        return err(unexpected("Lookup failed"));
      }
    },
  };
}

