/**
 * Directus-driven category slug.
 *
 * Known categories are documented here for UI labels and routing, but **new categories**
 * can be added in Directus without requiring a code deploy — they are treated as slugs.
 */
export type KnownArticleCategory =
  | "articles"
  | "testimonies"
  | "exodus"
  | "bible-study"
  | "series"
  | "prayer"
  | "ministry-development";

export type ArticleCategory = KnownArticleCategory | (string & {});

/** Lightweight series reference attached to each article that belongs to one. */
export type ArticleSeriesRef = {
  slug: string;
  title: string;
  /** 1-indexed chapter number inside the series, if known. */
  part?: number;
};

export type GrowthArticle = {
  slug: string;
  title: string;
  excerpt: string;
  /** Main body copy (plain text with optional inline links). */
  body?: string | null;
  category: ArticleCategory;
  author: string;
  date: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
  /** Parent series, if the article belongs to one. */
  series?: ArticleSeriesRef | null;
  /** Position within the parent series (1-indexed). */
  seriesSort?: number | null;
};

export const ARTICLE_CATEGORY_LABEL: Record<string, string> = {
  articles: "Articles",
  "as-we-walked": "As We Walked",
  testimonies: "Testimonies",
  exodus: "Exodus",
  "bible-study": "Bible Study",
  series: "Series",
  prayer: "Prayer",
  "ministry-development": "Ministry Development",
};

/**
 * Public article URL for the Growth section.
 *
 * Rules:
 * - Base: `/growth/<type>/<slug>`
 * - Series: `/growth/series/<seriesSlug>/<slug>`
 * - Category `articles` is singular: `/growth/article/<slug>`
 * - Category `bible-study` is compact: `/growth/biblestudy/<slug>`
 * - Category `ministry-development` is compact: `/growth/men-dev/<slug>`
 */
export function getGrowthArticleHref(article: Pick<GrowthArticle, "slug" | "category" | "series">): string {
  if (article.category === "series" || article.series?.slug) {
    const seriesSlug = article.series?.slug ?? "series";
    return `/growth/series/${seriesSlug}/${article.slug}`;
  }

  const type =
    article.category === "articles"
      ? "article"
      : article.category === "bible-study"
        ? "biblestudy"
        : article.category === "ministry-development"
          ? "men-dev"
          : article.category; // for Directus-added categories, the value is the URL segment

  return `/growth/${type}/${article.slug}`;
}

export function growthRouteTypeToCategory(type: string): Exclude<ArticleCategory, "series"> {
  if (type === "article") return "articles";
  if (type === "biblestudy") return "bible-study";
  if (type === "men-dev") return "ministry-development";
  return type;
}

/** Scaffold content — replace with CMS or API when ready */
export const GROWTH_ARTICLES: GrowthArticle[] = [
  {
    slug: "faith-that-moves",
    title: "Faith That Moves",
    excerpt: "How obedience reshapes the everyday when truth is lived, not only believed.",
    category: "articles",
    author: "Pastor Team",
    date: "Mar 12, 2026",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Open landscape at dawn",
    featured: true,
  },
  {
    slug: "exodus-wilderness",
    title: "Wilderness as Classroom",
    excerpt: "What Israel’s journey reveals about waiting, provision, and God’s presence.",
    category: "exodus",
    author: "Teaching Team",
    date: "Mar 8, 2026",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Mountain ridge at sunset",
  },
  {
    slug: "line-by-line-romans",
    title: "Line by Line: Romans",
    excerpt: "A slower read of Paul’s letter — justice, grace, and new life in Christ.",
    category: "bible-study",
    author: "Study Leaders",
    date: "Mar 5, 2026",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Open Bible on wood table",
  },
  {
    slug: "series-identity",
    title: "Series: Who You Are in Christ",
    excerpt: "Six weeks grounding identity in Scripture instead of circumstance.",
    category: "series",
    author: "theWalk",
    date: "Feb 28, 2026",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "People in community outdoors",
  },
  {
    slug: "prayer-covering",
    title: "Prayer Covering for the Week",
    excerpt: "A rhythm of intercession for families, leaders, and our city.",
    category: "prayer",
    author: "Prayer Team",
    date: "Feb 22, 2026",
    image:
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Hands folded in prayer",
  },
  {
    slug: "developing-leaders",
    title: "Developing Leaders Who Serve",
    excerpt: "Frameworks for raising faithful servants, not performers.",
    category: "ministry-development",
    author: "Ministry Team",
    date: "Feb 18, 2026",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Small group discussion",
  },
  {
    slug: "rest-and-rhythm",
    title: "Rest and Rhythm",
    excerpt: "Sabbath as gift — boundaries that protect devotion and joy.",
    category: "articles",
    author: "Pastor Team",
    date: "Feb 10, 2026",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Forest path",
  },
  {
    slug: "passover-pattern",
    title: "The Passover Pattern",
    excerpt: "Lamb, blood, and deliverance — shadows fulfilled in Christ.",
    category: "exodus",
    author: "Teaching Team",
    date: "Feb 4, 2026",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Stars over mountains",
  },
  {
    slug: "psalms-prayer",
    title: "Praying the Psalms",
    excerpt: "Using ancient songs to give language to grief, hope, and praise.",
    category: "prayer",
    author: "Prayer Team",
    date: "Jan 30, 2026",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Quiet reading nook",
  },
  {
    slug: "gospel-series-continued",
    title: "The Gospel, Clearly",
    excerpt: "Part four: resurrection hope and the mission of the church.",
    category: "series",
    author: "theWalk",
    date: "Jan 22, 2026",
    image:
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Church interior light",
  },
  {
    slug: "acts-study",
    title: "Acts: The Spirit Sends",
    excerpt: "Tracing the spread of the gospel from Jerusalem to the ends of the earth.",
    category: "bible-study",
    author: "Study Leaders",
    date: "Jan 15, 2026",
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Ancient map texture",
  },
  {
    slug: "team-health",
    title: "Healthy Teams, Healthy Ministry",
    excerpt: "Communication, care, and clarity for volunteer leaders.",
    category: "ministry-development",
    author: "Ministry Team",
    date: "Jan 8, 2026",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Team collaboration",
  },
];

export type GrowthCourse = {
  slug: string;
  title: string;
  description: string;
  duration: string;
  format: string;
  image: string;
  imageAlt: string;
};

export const GROWTH_COURSES: GrowthCourse[] = [
  {
    slug: "foundations",
    title: "Foundations of Faith",
    description: "Core truths for new believers and anyone resetting their walk.",
    duration: "6 weeks",
    format: "In person & online",
    image:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Notebook and coffee",
  },
  {
    slug: "scripture-tools",
    title: "Scripture Tools",
    description: "How to read context, genre, and gospel threads with confidence.",
    duration: "4 weeks",
    format: "Online",
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Studying with highlighter",
  },
  {
    slug: "spiritual-disciplines",
    title: "Spiritual Disciplines",
    description: "Prayer, fasting, and community rhythms that sustain long obedience.",
    duration: "5 weeks",
    format: "In person",
    image:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Journal and pen",
  },
  {
    slug: "leading-small-groups",
    title: "Leading Small Groups",
    description: "Facilitation, care, and Scripture-first discussion for hosts.",
    duration: "3 weeks",
    format: "Hybrid",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Circle of people",
  },
];

type DirectusListResponse<T> = { data: T[] };

/**
 * Directus "articles" collection schema (as authored in cms.thewalk.org):
 *   slug, title, excerpt, category, author, date_published,
 *   image (file), image_alt, featured, status, body
 *
 * Legacy (still supported during migration):
 *   image_url (string)
 */
type DirectusArticle = {
  slug: string;
  title: string;
  excerpt: string;
  body?: string | null;
  category: ArticleCategory;
  author: string;
  date_published: string | null;
  /** New: file field (uuid or { id }). */
  image?: string | { id: string } | null;
  /** Legacy: plain URL string field (kept for backwards compatibility). */
  image_url?: string | null;
  image_alt: string | null;
  featured?: boolean | null;
  /** Expanded via `fields=series.slug,series.title`. */
  series?: { slug: string; title: string } | null;
  series_sort?: number | null;
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

async function tryFetchDirectusArticles(): Promise<GrowthArticle[] | null> {
  const { directusFetch } = await import("@/lib/directus");
  const { cmsAssetPresets } = await import("@/lib/cms/assets");

  try {
    const res = await directusFetch<DirectusListResponse<DirectusArticle>>(
      "/items/articles",
      {
        fields:
          "slug,title,excerpt,body,category,author,date_published,image.id,image_url,image_alt,featured,series.slug,series.title,series_sort",
        filter: JSON.stringify({ status: { _eq: "published" } }),
        limit: 200,
        sort: "-date_published",
      },
      { next: { revalidate: 60, tags: ["articles"] } }
    );

    if (!res?.data?.length) return [];
    return res.data.map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      body: a.body ?? null,
      category: a.category,
      author: a.author ?? "",
      date: formatDate(a.date_published),
      image:
        (a.image
          ? cmsAssetPresets.card(
              typeof a.image === "string" ? a.image : a.image.id,
            )
          : a.image_url) ?? "",
      imageAlt: a.image_alt ?? "",
      featured: !!a.featured,
      series: a.series
        ? {
            slug: a.series.slug,
            title: a.series.title,
            part: a.series_sort ?? undefined,
          }
        : null,
      seriesSort: a.series_sort ?? null,
    }));
  } catch {
    return null;
  }
}

export async function getGrowthArticles(): Promise<GrowthArticle[]> {
  // Try the CMS whenever a URL is configured or the canonical host default
  // applies (handled in src/lib/directus.ts).
  const fromCms = await tryFetchDirectusArticles();
  if (fromCms && fromCms.length > 0) return fromCms;
  return GROWTH_ARTICLES;
}

export async function getGrowthArticleBySlug(slug: string): Promise<GrowthArticle | null> {
  const articles = await getGrowthArticles();
  return articles.find((a) => a.slug === slug) ?? null;
}

export async function getGrowthArticleByCategoryAndSlug(
  category: Exclude<ArticleCategory, "series">,
  slug: string,
): Promise<GrowthArticle | null> {
  const articles = await getGrowthArticles();
  return articles.find((a) => a.slug === slug && a.category === category) ?? null;
}

export async function getGrowthSeriesArticleBySeriesSlugAndSlug(
  seriesSlug: string,
  slug: string,
): Promise<GrowthArticle | null> {
  const articles = await getGrowthArticles();
  return (
    articles.find((a) => a.slug === slug && (a.category === "series" || a.series?.slug) && a.series?.slug === seriesSlug) ??
    null
  );
}
