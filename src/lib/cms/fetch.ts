/**
 * CMS fetch layer.
 *
 * Server-only helpers that query Directus for a page by slug and the
 * site_settings singleton, with Zod validation and graceful degradation.
 *
 * Key robustness rules:
 *   1. A single broken section is dropped; the rest of the page still renders.
 *   2. If Directus is unreachable we return `null`. Callers MUST have a
 *      hardcoded fallback so the site never appears broken.
 *   3. Only `status == "published"` rows are ever used by the public site
 *      (and the public read policy enforces this at the API level too).
 */
import "server-only";

import { directusFetch } from "@/lib/directus";
import {
  type Page,
  type SiteSettings,
  PageSchema,
  SiteSettingsSchema,
  SECTION_COLLECTIONS,
  SectionSchema,
} from "./schemas";

/* ─── field list construction ───────────────────────────────────────────── */

/** Section collections that have nested child collections (o2m items/tabs)
 * whose rows themselves reference files. We expand these explicitly so we
 * can still get the inner file ids. For json-repeater items (section_faq,
 * section_stats), `items` is a plain JSON column and the wildcard covers it.
 */
const NESTED_ITEM_EXPANSIONS: Partial<Record<string, string[]>> = {
  section_feature_cards: ["items.*", "items.icon.id"],
  section_ministry_tabs: ["tabs.*", "tabs.image.id"],
  section_timeline: ["items.*", "items.image.id"],
  section_testimonials: ["items.*", "items.image.id"],
  section_gallery: ["items.*", "items.image.id"],
  section_logo_strip: ["items.*", "items.logo.id"],
  section_doctrine_block: ["items.*"],
  section_principles_panel: ["items.*"],
  section_pathway_about: ["items.*"],
};

/** Extra file-field expansions for top-level section fields. */
const SECTION_FILE_EXPANSIONS: Partial<Record<string, string[]>> = {
  section_hero: ["image.id"],
  section_image_split: ["image.id"],
  section_ministry_tabs: [],
  section_cta_banner: ["background_image.id"],
  section_principles_panel: ["image.id"],
  section_pathway_hero: ["image.id"],
};

function buildPageFields(): string[] {
  const top = [
    "*",
    "seo_image.id",
    "sections.id",
    "sections.sort",
    "sections.collection",
  ];
  const perSection: string[] = [];
  for (const coll of SECTION_COLLECTIONS) {
    // Wildcard pulls every primitive column on the section
    perSection.push(`sections.item:${coll}.*`);
    for (const extra of SECTION_FILE_EXPANSIONS[coll] ?? []) {
      perSection.push(`sections.item:${coll}.${extra}`);
    }
    for (const extra of NESTED_ITEM_EXPANSIONS[coll] ?? []) {
      perSection.push(`sections.item:${coll}.${extra}`);
    }
  }
  return [...top, ...perSection];
}

/* ─── section normalisation ─────────────────────────────────────────────── */

type M2ARow = {
  id: number | string;
  sort?: number | null;
  collection?: string | null;
  item?: Record<string, unknown> | string | null;
};

function normaliseSections(rows: unknown): unknown[] {
  if (!Array.isArray(rows)) return [];
  const out: unknown[] = [];
  for (const row of rows as M2ARow[]) {
    if (!row || typeof row !== "object") continue;
    const coll = row.collection;
    const item = row.item;
    if (!coll || !item || typeof item !== "object") continue;
    // Normalise `status` so a null DB value doesn't break the schema
    const merged: Record<string, unknown> = {
      __collection: coll,
      _m2a_sort: typeof row.sort === "number" ? row.sort : 0,
      ...item,
    };
    if (merged.status == null) merged.status = "published";
    out.push(merged);
  }
  // Sort by the junction's sort field so editor ordering is preserved
  out.sort((a, b) => {
    const as = (a as { _m2a_sort?: number })._m2a_sort ?? 0;
    const bs = (b as { _m2a_sort?: number })._m2a_sort ?? 0;
    return as - bs;
  });
  return out;
}

/** Validate each section independently; skip (and warn about) invalid rows. */
function parseSections(raw: unknown[]): Page["sections"] {
  const parsed: Page["sections"] = [];
  for (const row of raw) {
    const result = SectionSchema.safeParse(row);
    if (result.success) {
      parsed.push(result.data);
      continue;
    }
    const coll = (row as { __collection?: string })?.__collection ?? "unknown";
    // Graceful: drop invalid section, keep rest.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[cms] dropped invalid section "${coll}": ${result.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; ")}`,
      );
    }
  }
  return parsed;
}

/* ─── public API ────────────────────────────────────────────────────────── */

export interface GetPageOptions {
  /** Include draft/archived sections (for preview mode). Requires DIRECTUS_TOKEN. */
  preview?: boolean;
  /** ISR revalidation seconds. Default 60. */
  revalidate?: number;
}

/** Fetch a page by slug. Returns null when not found or Directus unreachable. */
export async function getPage(
  slug: string,
  opts: GetPageOptions = {},
): Promise<Page | null> {
  const fields = buildPageFields();
  try {
    const res = await directusFetch<{ data: unknown[] }>(
      "/items/pages",
      {
        "filter[slug][_eq]": slug,
        "filter[status][_eq]": opts.preview ? undefined : "published",
        limit: 1,
        fields: fields.join(","),
        deep: JSON.stringify({
          sections: { _sort: ["sort"] },
        }),
      },
      {
        next: { revalidate: opts.revalidate ?? 60, tags: [`page:${slug}`] },
      },
    );
    const row = Array.isArray(res?.data) ? res.data[0] : null;
    if (!row || typeof row !== "object") return null;
    const normalisedSections = normaliseSections((row as Record<string, unknown>).sections);
    const sections = parseSections(normalisedSections);
    const candidate = { ...(row as Record<string, unknown>), sections };
    const parsed = PageSchema.safeParse(candidate);
    if (!parsed.success) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[cms] page "${slug}" failed validation: ${parsed.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("; ")}`,
        );
      }
      return null;
    }
    return parsed.data;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[cms] getPage("${slug}") failed:`, err);
    }
    return null;
  }
}

export async function getSiteSettings(
  opts: { revalidate?: number } = {},
): Promise<SiteSettings | null> {
  try {
    const res = await directusFetch<{ data: Record<string, unknown> | null }>(
      "/items/site_settings",
      {
        fields: [
          "nav_logo.id",
          "nav_logo_alt",
          "footer_logo.id",
          "footer_logo_alt",
          "default_og_image.id",
          "default_seo_title",
          "default_seo_description",
          "social_instagram",
          "social_facebook",
          "social_youtube",
          "social_tiktok",
          "contact_email",
          "contact_phone",
          "contact_address",
        ].join(","),
      },
      { next: { revalidate: opts.revalidate ?? 60, tags: ["site_settings"] } },
    );
    const row = res?.data;
    if (!row || typeof row !== "object") return null;
    const parsed = SiteSettingsSchema.safeParse(row);
    if (!parsed.success) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[cms] site_settings failed validation: ${parsed.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("; ")}`,
        );
      }
      return null;
    }
    return parsed.data;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[cms] getSiteSettings failed:", err);
    }
    return null;
  }
}

export async function listPublishedPageSlugs(): Promise<string[]> {
  try {
    const res = await directusFetch<{ data: Array<{ slug: string }> }>(
      "/items/pages",
      {
        "filter[status][_eq]": "published",
        fields: "slug",
        limit: -1,
      },
      { next: { revalidate: 300, tags: ["pages:list"] } },
    );
    return (res?.data ?? []).map((p) => p.slug).filter(Boolean);
  } catch {
    return [];
  }
}
