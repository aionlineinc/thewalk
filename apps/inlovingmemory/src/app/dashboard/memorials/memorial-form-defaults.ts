import type { IlmMemorialKind, IlmPrivacyLevel } from "@prisma/client";

export type MemorialFormDefaults = {
  displayName: string;
  kind: IlmMemorialKind;
  biography: string;
  birthDate: string;
  deathDate: string;
  country: string;
  parish: string;
  themePreset: string;
  primaryColor: string;
  accentColor: string;
  bannerPreset: string;
  privacyLevel: IlmPrivacyLevel;
  slug: string;
  hideFromDirectory: boolean;
  hideFromSearchEngines: boolean;
  tier: string;
};

function isoDateForInput(d: Date | null | undefined) {
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}

export function buildMemorialDefaults(row: {
  displayName: string;
  kind: IlmMemorialKind;
  biography: string | null;
  birthDate: Date | null;
  deathDate: Date | null;
  country: string | null;
  parish: string | null;
  themePreset: string | null;
  primaryColor: string | null;
  accentColor: string | null;
  bannerPreset: string | null;
  privacyLevel: IlmPrivacyLevel;
  tier: string;
  slug: string;
  hideFromDirectory: boolean;
  hideFromSearchEngines: boolean;
}): MemorialFormDefaults {
  return {
    displayName: row.displayName,
    kind: row.kind,
    biography: row.biography ?? "",
    birthDate: isoDateForInput(row.birthDate),
    deathDate: isoDateForInput(row.deathDate),
    country: row.country ?? "",
    parish: row.parish ?? "",
    themePreset: row.themePreset ?? "",
    primaryColor: row.primaryColor ?? "",
    accentColor: row.accentColor ?? "",
    bannerPreset: row.bannerPreset ?? "",
    privacyLevel: row.privacyLevel,
    tier: row.tier,
    slug: row.slug,
    hideFromDirectory: row.hideFromDirectory,
    hideFromSearchEngines: row.hideFromSearchEngines,
  };
}
