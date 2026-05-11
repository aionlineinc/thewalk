import { NextResponse } from "next/server";
import { getIlmSession } from "@/lib/auth";
import { STAFF_ROLES } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { presignPutObject } from "@/lib/ilm-storage";
import { getIlmStorageEnv } from "@/lib/ilm-storage-config";

export async function POST(req: Request) {
  const session = await getIlmSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!role || !STAFF_ROLES.has(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!getIlmStorageEnv().configured) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const label = (formData.get("label") as string)?.trim();
  const file = formData.get("file") as File | null;

  if (!label || !file) {
    return NextResponse.json({ error: "Label and file are required" }, { status: 400 });
  }

  if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
    return NextResponse.json({ error: "Use JPEG, PNG, WebP, or GIF" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "jpg";
  const presetId = crypto.randomUUID();
  const key = `ilm/banners/${presetId}.${ext}`;

  // Create the DB record
  const preset = await prisma.ilmBannerPreset.create({
    data: {
      id: presetId,
      label,
      storageUrl: "", // filled after presign
    },
  });

  // Get presigned upload URL
  const { uploadUrl, publicUrl } = await presignPutObject(key, file.type);

  // Update record with the public URL
  await prisma.ilmBannerPreset.update({
    where: { id: preset.id },
    data: { storageUrl: publicUrl },
  });

  return NextResponse.json({ uploadUrl, key, presetId: preset.id, publicUrl });
}
