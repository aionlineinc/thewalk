import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      app: "inLovingMemory",
      db: "connected",
      ...(process.env.GIT_COMMIT ? { commit: process.env.GIT_COMMIT } : {}),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ ok: false, db: "error", message }, { status: 503 });
  }
}
