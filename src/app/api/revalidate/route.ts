/**
 * Revalidation endpoint for Directus webhooks.
 *
 * Directus Flow config:
 *   Trigger:   Event Hook → action.items.{create,update,delete}
 *   Scope:     pages, site_settings, pages_sections, section_*
 *   Operation: Webhook (POST) to
 *              `${NEXT_PUBLIC_APP_URL}/api/revalidate`
 *   Headers:   `x-revalidate-secret: ${REVALIDATION_SECRET}`
 *   Body:      JSON. The route accepts either:
 *                { "tag": "page:home" }            → revalidates the page
 *                { "path": "/about" }              → revalidates a path
 *                { "collection": "pages", "keys": ["home"] }
 *                   → revalidates each slug as `page:<slug>`
 *              If no body, revalidates the global `cms` tag.
 *
 * Security: requires the shared secret in header OR `?secret=` query param.
 */
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATION_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }
  const provided =
    req.headers.get("x-revalidate-secret") ||
    req.nextUrl.searchParams.get("secret") ||
    "";
  if (provided !== secret) return unauthorized();

  let body: Record<string, unknown> = {};
  try {
    const raw = await req.text();
    body = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch {
    body = {};
  }

  const revalidated: string[] = [];

  const tag = typeof body.tag === "string" ? body.tag : null;
  const path = typeof body.path === "string" ? body.path : null;
  const collection = typeof body.collection === "string" ? body.collection : null;
  const keys = Array.isArray(body.keys) ? body.keys : null;

  if (tag) {
    revalidateTag(tag);
    revalidated.push(`tag:${tag}`);
  }
  if (path) {
    revalidatePath(path);
    revalidated.push(`path:${path}`);
  }

  if (collection === "pages" && keys) {
    for (const slug of keys) {
      if (typeof slug !== "string") continue;
      revalidateTag(`page:${slug}`);
      revalidated.push(`tag:page:${slug}`);
    }
  } else if (collection === "site_settings") {
    revalidateTag("site_settings");
    revalidated.push("tag:site_settings");
  } else if (collection && collection.startsWith("section_")) {
    revalidateTag("cms");
    revalidated.push("tag:cms");
  }

  if (revalidated.length === 0) {
    revalidateTag("cms");
    revalidated.push("tag:cms");
  }

  return NextResponse.json({ ok: true, revalidated, at: new Date().toISOString() });
}

export async function GET(req: NextRequest) {
  const secret = process.env.REVALIDATION_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }
  const provided = req.nextUrl.searchParams.get("secret") || "";
  if (provided !== secret) return unauthorized();
  return NextResponse.json({ ok: true, alive: true });
}
