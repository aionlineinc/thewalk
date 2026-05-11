import { requireStaffSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { AdminBannersClient } from "./client";

export const metadata = {
  title: "Banners · Admin · inLovingMemory",
};

export default async function AdminBannersPage() {
  await requireStaffSession();

  const presets = await prisma.ilmBannerPreset.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, label: true, storageUrl: true },
  });

  return <AdminBannersClient presets={presets} />;
}
