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

export const BANNER_PRESETS: Record<string, BannerPreset> = {
  "sunset-vigil": {
    label: "Sunset Vigil",
    url: "https://images.unsplash.com/photo-1475776408506-9a5371e7a068?w=1920&q=85",
  },
  "golden-light": {
    label: "Golden Light",
    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=85",
  },
  "oak-ceremony": {
    label: "Oak Ceremony",
    url: "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?w=1920&q=85",
  },
  "autumn-path": {
    label: "Autumn Path",
    url: "https://images.unsplash.com/photo-1506815928480-bc4456a7e4fe?w=1920&q=85",
  },
  "amber-meadow": {
    label: "Amber Meadow",
    url: "https://images.unsplash.com/photo-1501425135621-5ac8feab6403?w=1920&q=85",
  },
  "quiet-shore": {
    label: "Quiet Shore",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=85",
  },
};
