import { NextResponse } from "next/server";
import { createScriptureService } from "@/modules/scripture";

/**
 * Supported translations for https://bible-api.com (see `/data`).
 *
 * Note: NKJV is **not** available here (copyrighted translation). If you need NKJV,
 * you’ll need a licensed Bible text provider + a different API route implementation.
 */
const BIBLE_API_TRANSLATIONS = new Set([
  "asv",
  "bbe",
  "darby",
  "dra",
  "kjv",
  "web",
  "ylt",
  "oeb-cw",
  "webbe",
  "oeb-us",
  // Non-English / specialty public-domain texts also exposed by bible-api.com
  "cherokee",
  "cuv",
  "bkr",
  "clementine",
  "almeida",
  "rccv",
  "synodal",
]);

const TRANSLATION_LABEL: Record<string, string> = {
  web: "World English Bible",
  kjv: "King James Version",
  asv: "American Standard Version (1901)",
  bbe: "Bible in Basic English",
  darby: "Darby Bible",
  dra: "Douay-Rheims 1899 American Edition",
  ylt: "Young's Literal Translation (NT only)",
  "oeb-cw": "Open English Bible, Commonwealth Edition",
  webbe: "World English Bible, British Edition",
  "oeb-us": "Open English Bible, US Edition",
};

function getRequestedTranslation(): { id: string; label: string } {
  const raw = (process.env.BIBLE_API_TRANSLATION ?? "web").trim().toLowerCase();
  const id = BIBLE_API_TRANSLATIONS.has(raw) ? raw : "web";
  return { id, label: TRANSLATION_LABEL[id] ?? id.toUpperCase() };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref");
  if (!ref || ref.length > 160) {
    return NextResponse.json({ error: "Invalid reference" }, { status: 400 });
  }

  const translation = getRequestedTranslation();

  const scripture = createScriptureService();
  const result = await scripture.lookup({ ref });

  if (!result.ok) {
    const e = result.error;
    if (e.kind === "Validation") return NextResponse.json({ error: "Invalid reference" }, { status: 400 });
    if (e.message === "Passage not found") return NextResponse.json({ error: "Passage not found" }, { status: 404 });
    return NextResponse.json({ error: "Lookup failed" }, { status: 502 });
  }

  return NextResponse.json(
    {
      reference: result.value.reference,
      text: result.value.text,
      translationName: result.value.translationName ?? translation.label,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
