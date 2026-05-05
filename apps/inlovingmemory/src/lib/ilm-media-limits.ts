import type { IlmTier } from "@prisma/client";

export function byteLimitForTier(tier: IlmTier): number {
  if (tier === "BASIC") return 5 * 1024 * 1024;
  return 10 * 1024 * 1024;
}

export function galleryPhotoLimitForTier(tier: IlmTier): number {
  if (tier === "BASIC") return 20;
  return 500;
}
