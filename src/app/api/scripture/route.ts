import { NextResponse } from "next/server";

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
  const url = `https://bible-api.com/${encodeURIComponent(trimmed)}`;

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
        translationName: data.translation_name ?? "World English Bible",
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
