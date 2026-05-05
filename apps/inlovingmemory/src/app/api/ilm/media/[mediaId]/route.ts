import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { deleteStorageObject } from "@/lib/ilm-storage";
import { storageKeyFromPublicUrl } from "@/lib/ilm-storage-config";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: { mediaId: string } },
) {
  const session = await getServerSession(getAuthOptions());
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const row = await prisma.ilmMedia.findUnique({
    where: { id: params.mediaId },
    include: { memorial: { select: { pageKeeperId: true, slug: true } } },
  });

  if (!row || row.memorial.pageKeeperId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const key = storageKeyFromPublicUrl(row.storageUrl);
  if (key) {
    try {
      await deleteStorageObject(key);
    } catch (e) {
      console.warn("[ilm delete media] storage delete", e);
    }
  }

  await prisma.ilmMedia.delete({ where: { id: row.id } });

  return new NextResponse(null, { status: 204 });
}
