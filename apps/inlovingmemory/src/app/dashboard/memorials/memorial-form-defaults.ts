import type { IlmMemorialKind, IlmPrivacyLevel } from "@prisma/client";

export type MemorialFormDefaults = {
  displayName: string;
  kind: IlmMemorialKind;
  biography: string;
  birthDate: string;
  deathDate: string;
  privacyLevel: IlmPrivacyLevel;
  slug: string;
  hideFromDirectory: boolean;
  hideFromSearchEngines: boolean;
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
  privacyLevel: IlmPrivacyLevel;
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
    privacyLevel: row.privacyLevel,
    slug: row.slug,
    hideFromDirectory: row.hideFromDirectory,
    hideFromSearchEngines: row.hideFromSearchEngines,
  };
}
