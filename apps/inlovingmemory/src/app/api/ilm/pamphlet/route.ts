import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { getAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  memorialId: z.string().uuid(),
  pdfUrl: z.string().url().max(1000).nullable(),
});

export async function POST(req: Request) {
  const session = await getServerSession(getAuthOptions());
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;
  if (!userId) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  let json: unknown;
  try { json = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { memorialId, pdfUrl } = parsed.data;

  const memorial = await prisma.ilmMemorial.findUnique({
    where: { id: memorialId },
    select: { pageKeeperId: true },
  });

  if (!memorial || memorial.pageKeeperId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.ilmPamphlet.findFirst({ where: { memorialId } });

  let result: { id: string; pdfUrl: string | null };
  if (existing) {
    result = await prisma.ilmPamphlet.update({
      where: { id: existing.id },
      data: { pdfUrl },
    });
  } else {
    result = await prisma.ilmPamphlet.create({
      data: { memorialId, pdfUrl },
    });
  }

  return NextResponse.json({ pdfUrl: result.pdfUrl });
}
