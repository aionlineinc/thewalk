import { NextResponse } from "next/server";
import { checkDb } from "@/server/services";

export async function GET() {
  const result = await checkDb();
  if (!result.ok) return NextResponse.json({ ok: false, error: "db_unreachable" }, { status: 503 });
  return NextResponse.json({ ok: true, now: result.value.now });
}

