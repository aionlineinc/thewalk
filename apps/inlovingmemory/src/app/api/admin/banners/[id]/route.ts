import { NextResponse } from "next/server";
import { getIlmSession } from "@/lib/auth";
import { STAFF_ROLES } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getIlmSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!role || !STAFF_ROLES.has(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.ilmBannerPreset.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
