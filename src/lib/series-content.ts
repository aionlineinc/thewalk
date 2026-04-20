/**
 * Series content.
 *
 * A "series" is a first-class collection of articles in Directus:
 *
 *   series           — has { slug, title, subtitle, description, cover, is_current, … }
 *   articles.series  — m2o → series.id (nullable; not every article belongs to a series)
 *   articles.series_sort — integer ordering within the parent series
 *
 * Both the homepage "Current Series" block and the /growth/articles
 * "Series" filter read from this module so the two surfaces never drift
 * apart again.
 *
 * If Directus is unreachable or the `series` collection hasn't been
 * seeded yet, `getCurrentSeries()` falls back to a hardcoded
 * "Components of Walking" scaffold so the homepage never appears empty.
 */
import { cmsAssetPresets } from "@/lib/cms/assets";

import type { GrowthArticle } from "@/lib/growth-content";

/** Short reference embedded on a GrowthArticle to link it back to its parent series. */
export interface SeriesRef {
  slug: string;
  title: string;
  /** 1-indexed chapter number within the series, if known. */
  part?: number;
}

/** An article inside a series. Thin — only what the homepage cards need. */
export interface SeriesArticleCard {
  slug: string;
  title: string;
  /** Short blurb shown under the title. */
  description: string;
  image: string;
  imageAlt: string;
}

export interface Series {
  slug: string;
  title: string;
  /** Short tagline shown above the title on detail views. */
  subtitle?: string | null;
  /** Long copy shown next to the card grid on the homepage. */
  description?: string | null;
  /** Cover image used when showing the series itself (not individual cards). */
  coverImage?: string | null;
  coverAlt?: string | null;
  /** Ordered chapter articles. */
  articles: SeriesArticleCard[];
}

/* ─── scaffold fallback ─────────────────────────────────────────────────── */

/**
 * The original hardcoded homepage content, kept verbatim so the site
 * never regresses visually if Directus is unavailable. Each "article"
 * here is a stub (hrefs go to /growth/articles) because these aren't
 * real Directus rows.
 */
const COMPONENTS_OF_WALKING_FALLBACK: Series = {
  slug: "components-of-walking",
  title: "The Current series",
  subtitle: "Components of Walking",
  description:
    "As believers, the concept of \u201cwalking\u201d should have some significance to us in the context of our faith. These six parts outline what is necessary for purposeful walking / movement to take place.",
  articles: [
    {
      slug: "components-of-walking",
      title: "Components of Walking",
      description: "What components influence your journey through life?",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=900&auto=format&fit=crop",
      imageAlt: "Wide landscape — components of a journey",
    },
    {
      slug: "a-desire-to-move",
      title: "A Desire to Move",
      description: "It begins with love",
      image:
        "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=900&auto=format&fit=crop",
      imageAlt: "Warm sunrise — desire and beginnings",
    },
    {
      slug: "a-path-chosen",
      title: "A Path Chosen",
      description: "Directed by glory",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=900&auto=format&fit=crop",
      imageAlt: "Forest path — a chosen way",
    },
    {
      slug: "movement",
      title: "Movement",
      description: "Powered by Faith",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=900&auto=format&fit=crop",
      imageAlt: "Mountain vista — forward movement",
    },
    {
      slug: "staying-the-course",
      title: "Staying the Course",
      description: "Seasons and Cycles",
      image:
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=900&auto=format&fit=crop",
      imageAlt: "Misty hills — seasons and endurance",
    },
    {
      slug: "destinations",
      title: "Destinations",
      description: "Where are we going, and how will we get there?",
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=900&auto=format&fit=crop",
      imageAlt: "Lake and mountains — destination ahead",
    },
  ],
};

/* ─── Directus types + helpers ──────────────────────────────────────────── */

type DirectusListResponse<T> = { data: T[] };

type DirectusArticleInSeries = {
  slug: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  image_alt: string | null;
  series_sort: number | null;
};

type DirectusSeriesRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_image: string | { id: string } | null;
  cover_alt: string | null;
  is_current: boolean | null;
  sort: number | null;
  articles?: DirectusArticleInSeries[];
};

/**
 * Expand a Directus file reference (uuid string or {id} object) into an
 * absolute URL using the shared `cmsAssetPresets.card` preset.
 */
function resolveImage(ref: DirectusSeriesRow["cover_image"]): string | null {
  if (!ref) return null;
  if (typeof ref === "string") return cmsAssetPresets.card(ref);
  return cmsAssetPresets.card(ref.id);
}

function mapSeries(row: DirectusSeriesRow): Series {
  const articles = (row.articles ?? [])
    .slice()
    .sort((a, b) => (a.series_sort ?? 0) - (b.series_sort ?? 0))
    .map(
      (a): SeriesArticleCard => ({
        slug: a.slug,
        title: a.title,
        description: a.excerpt ?? "",
        image: a.image_url ?? "",
        imageAlt: a.image_alt ?? "",
      }),
    );

  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    coverImage: resolveImage(row.cover_image),
    coverAlt: row.cover_alt,
    articles,
  };
}

/* ─── public API ────────────────────────────────────────────────────────── */

/**
 * Return the current (homepage-featured) series, or the scaffold fallback
 * if none exists / Directus is unreachable.
 *
 * "Current" is defined as `is_current == true`. If multiple are marked
 * current we return the first (lowest `sort`). If none are marked, we
 * return the most recent series (highest `sort`). If even that is empty,
 * we use the hardcoded scaffold so the homepage never goes blank.
 */
export async function getCurrentSeries(): Promise<Series> {
  const { directusFetch } = await import("@/lib/directus");

  const fields = [
    "id",
    "slug",
    "title",
    "subtitle",
    "description",
    "cover_image",
    "cover_alt",
    "is_current",
    "sort",
    "articles.slug",
    "articles.title",
    "articles.excerpt",
    "articles.image_url",
    "articles.image_alt",
    "articles.series_sort",
    "articles.status",
  ].join(",");

  try {
    // Try the explicitly-flagged current series first.
    const featured = await directusFetch<DirectusListResponse<DirectusSeriesRow>>(
      "/items/series",
      {
        fields,
        filter: JSON.stringify({
          status: { _eq: "published" },
          is_current: { _eq: true },
        }),
        sort: "sort",
        limit: 1,
      },
      { next: { revalidate: 60, tags: ["series"] } },
    );
    let row = featured?.data?.[0];

    if (!row) {
      // Fall back to the most recent published series.
      const latest = await directusFetch<DirectusListResponse<DirectusSeriesRow>>(
        "/items/series",
        {
          fields,
          filter: JSON.stringify({ status: { _eq: "published" } }),
          sort: "-sort",
          limit: 1,
        },
        { next: { revalidate: 60, tags: ["series"] } },
      );
      row = latest?.data?.[0];
    }

    if (!row) return COMPONENTS_OF_WALKING_FALLBACK;

    const mapped = mapSeries(row);
    if (mapped.articles.length === 0) return COMPONENTS_OF_WALKING_FALLBACK;
    return mapped;
  } catch {
    return COMPONENTS_OF_WALKING_FALLBACK;
  }
}

/**
 * Group a flat list of GrowthArticle by their parent series.
 *
 * Articles without a `series` are dropped. The returned groups are
 * ordered by the order they first appear in the input (which is
 * typically newest-first).
 */
export function groupArticlesBySeries(
  articles: GrowthArticle[],
): Array<{ series: SeriesRef; items: GrowthArticle[] }> {
  const bySlug = new Map<string, { series: SeriesRef; items: GrowthArticle[] }>();
  for (const a of articles) {
    if (!a.series) continue;
    const key = a.series.slug;
    const bucket = bySlug.get(key);
    if (bucket) {
      bucket.items.push(a);
    } else {
      bySlug.set(key, { series: a.series, items: [a] });
    }
  }
  // Sort each bucket by seriesSort (nulls last) then by date.
  for (const b of bySlug.values()) {
    b.items.sort((x, y) => {
      const xs = x.seriesSort ?? Number.POSITIVE_INFINITY;
      const ys = y.seriesSort ?? Number.POSITIVE_INFINITY;
      return xs - ys;
    });
  }
  return Array.from(bySlug.values());
}
