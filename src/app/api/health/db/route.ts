import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const result = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() as now`;
    return NextResponse.json({ ok: true, now: result?.[0]?.now ?? null });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "db_unreachable" }, { status: 503 });
  }
}

