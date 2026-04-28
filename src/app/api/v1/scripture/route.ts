import { NextResponse } from "next/server";
import { createScriptureService } from "@/modules/scripture";
import { verifyApiKey } from "@/server/apiKeys";

export async function GET(req: Request) {
  const auth = await verifyApiKey({
    apiKey: req.headers.get("x-api-key"),
    requiredScopes: ["PUBLIC_READ"],
  });
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref");
  if (!ref) return NextResponse.json({ ok: false, error: "missing_ref" }, { status: 400 });

  const scripture = createScriptureService();
  const result = await scripture.lookup({ ref });
  if (!result.ok) {
    const e = result.error;
    if (e.kind === "Validation") return NextResponse.json({ ok: false, error: "invalid_ref" }, { status: 400 });
    if (e.message === "Passage not found") return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: false, error: "upstream_error" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, ...result.value });
}

