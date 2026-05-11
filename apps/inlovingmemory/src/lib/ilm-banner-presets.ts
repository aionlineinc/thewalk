import { prisma } from "@/lib/prisma";

export interface BannerPreset {
  label: string;
  url: string;
}

export async function getCustomBannerPresets(): Promise<Record<string, BannerPreset>> {
  const rows = await prisma.ilmBannerPreset.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, label: true, storageUrl: true },
  });
  const map: Record<string, BannerPreset> = {};
  for (const r of rows) {
    map[`custom:${r.id}`] = { label: r.label, url: r.storageUrl };
  }
  return map;
}

