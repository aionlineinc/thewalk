import { IlmMediaKind, IlmPrivacyLevel, IlmSubmissionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  memorialSlug: z.string().min(1).max(200),
  key: z.string().min(1).max(500),
  authorName: z.string().min(1).max(120),
  kind: z.nativeEnum(IlmMediaKind),
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

  const { memorialSlug, key, authorName, kind } = parsed.data;

  const memorial = await prisma.ilmMemorial.findUnique({
    where: { slug: memorialSlug },
    select: { id: true, privacyLevel: true },
  });

  if (!memorial || memorial.privacyLevel !== IlmPrivacyLevel.PUBLIC) {
    return NextResponse.json({ error: "Memorial not found or not public" }, { status: 404 });
  }

  // Verify the key belongs to this memorial
  if (!key.startsWith(`ilm/${memorial.id}/guest/`)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  const media = await prisma.ilmMedia.create({
    data: {
      memorialId: memorial.id,
      kind,
      storageUrl: "", // filled below after the presigned URL resolves
      authorGuestName: authorName.trim(),
      status: IlmSubmissionStatus.PENDING,
    },
  });

  // Set the storage URL based on the key
  const { publicUrlForStorageKey } = await import("@/lib/ilm-storage-config");
  const storageUrl = publicUrlForStorageKey(key);

  await prisma.ilmMedia.update({
    where: { id: media.id },
    data: { storageUrl },
  });

  revalidatePath(`/memorial/${memorialSlug}`);

  return NextResponse.json({ id: media.id, ok: true });
}
