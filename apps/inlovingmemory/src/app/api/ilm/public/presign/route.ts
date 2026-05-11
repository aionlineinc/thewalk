import { IlmMediaKind, IlmPrivacyLevel } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { byteLimitForTier } from "@/lib/ilm-media-limits";
import { presignPutObject } from "@/lib/ilm-storage";
import { getIlmStorageEnv } from "@/lib/ilm-storage-config";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  memorialSlug: z.string().min(1).max(200),
  fileName: z.string().min(1).max(200),
  contentType: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "audio/mpeg",
    "audio/mp4",
    "audio/wav",
    "audio/webm",
  ]),
  byteSize: z.number().int().positive(),
  authorName: z.string().min(1).max(120),
  kind: z.nativeEnum(IlmMediaKind),
});

function safeFileSegment(name: string) {
  const base = name.replace(/^.*[/\\]/, "").replace(/[^a-zA-Z0-9._-]+/g, "-");
  return base.slice(0, 96) || "media";
}

export async function POST(req: Request) {
  if (!getIlmStorageEnv().configured) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  let json: unknown;
  try { json = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { memorialSlug, fileName, contentType, byteSize, kind } = parsed.data;

  const memorial = await prisma.ilmMemorial.findUnique({
    where: { slug: memorialSlug },
    select: { id: true, privacyLevel: true, tier: true },
  });

  if (!memorial || memorial.privacyLevel !== IlmPrivacyLevel.PUBLIC) {
    return NextResponse.json({ error: "Memorial not found or not public" }, { status: 404 });
  }

  const maxBytes = byteLimitForTier(memorial.tier);
  if (byteSize > maxBytes) {
    return NextResponse.json(
      { error: `File too large (max ${Math.round(maxBytes / (1024 * 1024))} MB).` },
      { status: 400 },
    );
  }

  const idPart = crypto.randomUUID();
  const key = `ilm/${memorial.id}/guest/${idPart}-${safeFileSegment(fileName)}`;

  try {
    const out = await presignPutObject(key, contentType);
    return NextResponse.json(out);
  } catch (e) {
    console.error("[ilm public presign]", e);
    return NextResponse.json({ error: "Could not create upload URL" }, { status: 500 });
  }
}
