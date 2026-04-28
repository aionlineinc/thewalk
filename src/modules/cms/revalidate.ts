import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

function requireSecret(req: NextRequest): string | null {
  const secret = process.env.REVALIDATION_SECRET;
  if (!secret) return null;
  const provided =
    req.headers.get("x-revalidate-secret") ||
    req.nextUrl.searchParams.get("secret") ||
    "";
  if (provided !== secret) return "unauthorized";
  return "ok";
}

export async function handleCmsRevalidatePOST(req: NextRequest) {
  const auth = requireSecret(req);
  if (auth === null) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  if (auth !== "ok") return unauthorized();

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

export async function handleCmsRevalidateGET(req: NextRequest) {
  const auth = requireSecret(req);
  if (auth === null) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  if (auth !== "ok") return unauthorized();
  return NextResponse.json({ ok: true, alive: true });
}

