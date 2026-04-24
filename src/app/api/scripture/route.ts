import { NextResponse } from "next/server";

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

type BibleApiVerse = {
  verse: number;
  text: string;
  chapter: number;
  book_name: string;
};

type BibleApiResponse = {
  reference: string;
  verses: BibleApiVerse[];
  text: string;
  translation_name?: string;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref");
  if (!ref || ref.length > 160) {
    return NextResponse.json({ error: "Invalid reference" }, { status: 400 });
  }

  const trimmed = ref.trim();
  const translation = getRequestedTranslation();
  const url = `https://bible-api.com/${encodeURIComponent(trimmed)}?translation=${encodeURIComponent(translation.id)}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Passage not found" }, { status: 404 });
    }

    const data = (await res.json()) as BibleApiResponse;
    const text =
      typeof data.text === "string" && data.text.trim().length > 0
        ? data.text.trim()
        : (data.verses ?? []).map((v) => v.text.trim()).join("\n\n");

    return NextResponse.json(
      {
        reference: data.reference,
        text: text || "No text returned for this reference.",
        translationName: data.translation_name ?? translation.label,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "Lookup failed" }, { status: 502 });
  }
}
