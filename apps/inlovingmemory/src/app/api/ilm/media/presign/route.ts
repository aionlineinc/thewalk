import { IlmMediaKind, type IlmTier } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import {
  ILM_MEDIA_TITLE_BANNER,
  ILM_MEDIA_TITLE_PROFILE,
} from "@/lib/ilm-media-slots";
import { galleryPhotoLimitForTier, byteLimitForTier } from "@/lib/ilm-media-limits";
import { presignPutObject } from "@/lib/ilm-storage";
import { getIlmStorageEnv } from "@/lib/ilm-storage-config";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  memorialId: z.string().uuid(),
  slot: z.enum(["gallery", "profile", "banner"]),
  fileName: z.string().min(1).max(200),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  byteSize: z.number().int().positive(),
});

function safeFileSegment(name: string) {
  const base = name.replace(/^.*[/\\]/, "").replace(/[^a-zA-Z0-9._-]+/g, "-");
  return base.slice(0, 96) || "image";
}

export async function POST(req: Request) {
  if (!getIlmStorageEnv().configured) {
    return NextResponse.json(
      { error: "Object storage is not configured (set ILM_S3_* environment variables)." },
      { status: 503 },
    );
  }

  const session = await getServerSession(getAuthOptions());
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { memorialId, slot, fileName, contentType, byteSize } = parsed.data;

  const memorial = await prisma.ilmMemorial.findUnique({
    where: { id: memorialId },
    select: { pageKeeperId: true, tier: true },
  });

  if (!memorial || memorial.pageKeeperId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const maxBytes = byteLimitForTier(memorial.tier as IlmTier);
  if (byteSize > maxBytes) {
    return NextResponse.json(
      { error: `File too large (max ${Math.round(maxBytes / (1024 * 1024))} MB for your plan).` },
      { status: 400 },
    );
  }

  if (slot === "gallery") {
    const maxPhotos = galleryPhotoLimitForTier(memorial.tier as IlmTier);
    const galleryCount = await prisma.ilmMedia.count({
      where: {
        memorialId,
        kind: IlmMediaKind.PHOTO,
        NOT: {
          OR: [{ title: ILM_MEDIA_TITLE_PROFILE }, { title: ILM_MEDIA_TITLE_BANNER }],
        },
      },
    });
    if (galleryCount >= maxPhotos) {
      return NextResponse.json(
        { error: `Photo gallery limit reached (${maxPhotos} for your plan).` },
        { status: 400 },
      );
    }
  }

  const idPart = crypto.randomUUID();
  const key = `ilm/${memorialId}/${idPart}-${safeFileSegment(fileName)}`;

  try {
    const out = await presignPutObject(key, contentType);
    return NextResponse.json(out);
  } catch (e) {
    console.error("[ilm presign]", e);
    return NextResponse.json({ error: "Could not create upload URL" }, { status: 500 });
  }
}
