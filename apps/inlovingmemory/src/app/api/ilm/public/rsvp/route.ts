import { IlmPrivacyLevel } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  eventId: z.string().uuid(),
  guestName: z.string().min(1).max(120),
  guestEmail: z.string().email().max(320).optional(),
  guestCount: z.number().int().min(1).max(20).optional(),
  message: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  let json: unknown;
  try { json = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { eventId, guestName, guestEmail, guestCount, message } = parsed.data;

  // Verify event belongs to a public memorial
  const event = await prisma.ilmEvent.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      memorial: { select: { privacyLevel: true } },
    },
  });

  if (!event || event.memorial.privacyLevel !== IlmPrivacyLevel.PUBLIC) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.ilmEventRsvp.create({
    data: {
      eventId,
      guestName: guestName.trim(),
      guestEmail: guestEmail?.trim() || null,
      guestCount: guestCount ?? 1,
      message: message?.trim() || null,
    },
  });

  return NextResponse.json({ ok: true });
}
