import { NextResponse } from "next/server";
import { outboxService } from "@/server/services";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.INTERNAL_DISPATCH_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });

  const provided = req.headers.get("x-internal-secret") ?? "";
  if (provided !== secret) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as any;
  const limit = typeof body.limit === "number" ? body.limit : 50;

  const outbox = outboxService();
  const result = await outbox.dispatchBatch({ limit });
  return NextResponse.json({ ok: true, ...result });
}

