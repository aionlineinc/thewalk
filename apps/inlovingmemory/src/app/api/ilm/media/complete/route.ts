import { IlmMediaKind, IlmSubmissionStatus, type IlmTier } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import {
  ILM_MEDIA_TITLE_BANNER,
  ILM_MEDIA_TITLE_PROFILE,
} from "@/lib/ilm-media-slots";
import { galleryPhotoLimitForTier } from "@/lib/ilm-media-limits";
import { deleteStorageObject } from "@/lib/ilm-storage";
import {
  getIlmStorageEnv,
  publicUrlForStorageKey,
  storageKeyFromPublicUrl,
} from "@/lib/ilm-storage-config";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  memorialId: z.string().uuid(),
  key: z.string().min(3).max(500),
  slot: z.enum(["gallery", "profile", "banner"]),
  caption: z.string().max(200).optional(),
  byteSize: z.number().int().positive().optional(),
});

function expectedKeyPrefix(memorialId: string) {
  return `ilm/${memorialId}/`;
}

export async function POST(req: Request) {
  if (!getIlmStorageEnv().configured) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
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

  const { memorialId, key, slot, caption, byteSize } = parsed.data;

  if (!key.startsWith(expectedKeyPrefix(memorialId))) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  const memorial = await prisma.ilmMemorial.findUnique({
    where: { id: memorialId },
    select: { pageKeeperId: true, tier: true },
  });

  if (!memorial || memorial.pageKeeperId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const storageUrl = publicUrlForStorageKey(key);
  if (!storageUrl) {
    return NextResponse.json({ error: "Public URL not configured" }, { status: 500 });
  }

  const titleForSlot =
    slot === "profile"
      ? ILM_MEDIA_TITLE_PROFILE
      : slot === "banner"
        ? ILM_MEDIA_TITLE_BANNER
        : caption?.trim() || null;

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
      return NextResponse.json({ error: "Gallery limit reached" }, { status: 400 });
    }
  }

  const prevSlot =
    slot === "profile"
      ? await prisma.ilmMedia.findFirst({
          where: { memorialId, title: ILM_MEDIA_TITLE_PROFILE },
        })
      : slot === "banner"
        ? await prisma.ilmMedia.findFirst({
            where: { memorialId, title: ILM_MEDIA_TITLE_BANNER },
          })
        : null;

  if (prevSlot?.storageUrl) {
    try {
      const oldKey = storageKeyFromPublicUrl(prevSlot.storageUrl);
      if (oldKey) await deleteStorageObject(oldKey);
    } catch (e) {
      console.warn("[ilm complete] could not delete previous object", e);
    }
  }

  if (prevSlot) {
    await prisma.ilmMedia.delete({ where: { id: prevSlot.id } });
  }

  const row = await prisma.ilmMedia.create({
    data: {
      memorialId,
      kind: IlmMediaKind.PHOTO,
      storageUrl,
      title: titleForSlot,
      byteSize: byteSize ?? null,
      status: IlmSubmissionStatus.APPROVED,
      submittedByUserId: userId,
    },
  });

  return NextResponse.json({ id: row.id, storageUrl });
}
