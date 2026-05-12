import { ilmMarketingDefault, type IlmMarketingContent } from "@/content/ilm-marketing.default";
import { directusGetJson, getDirectusConfig } from "@/lib/cms/directus-client";

type IlmSectionRow = {
  collection?: string | null;
  item?: Record<string, unknown> | null;
  sort?: number | null;
};

type IlmPageRow = {
  slug?: string;
  title?: string;
  sections?: IlmSectionRow[];
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) return base;
  const merged: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const current = merged[key];
    if (isPlainObject(current) && isPlainObject(value)) {
      merged[key] = deepMerge(current, value);
      continue;
    }
    merged[key] = value;
  }

  return merged as T;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function firstSection(page: IlmPageRow | undefined, collection: string): Record<string, unknown> | null {
  if (!page?.sections || !Array.isArray(page.sections)) return null;
  const rows = [...page.sections]
    .filter((row) => row.collection === collection && isPlainObject(row.item))
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
  return (rows[0]?.item as Record<string, unknown>) ?? null;
}

function fileRefToUrl(baseUrl: string, fileRef: unknown): string | null {
  const directUrl = asString(fileRef);
  if (directUrl) return directUrl;
  if (isPlainObject(fileRef) && typeof fileRef.id === "string") {
    return `${baseUrl}/assets/${fileRef.id}`;
  }
  return null;
}

async function getStructuredPagesContent(
  cfg: { baseUrl: string; token?: string },
): Promise<Partial<IlmMarketingContent> | null> {
  const slugs = [
    "ilm-home",
    "ilm-about",
    "ilm-how-it-works",
    "ilm-pricing",
    "ilm-faq",
    "ilm-resources",
    "ilm-sign-in",
  ];
  const appName = process.env.ILM_PAGES_APP?.trim() || "inlovingmemory";

  const params = new URLSearchParams({
    limit: String(slugs.length),
    fields: [
      "slug",
      "title",
      "sections.sort",
      "sections.collection",
      "sections.item:section_hero.*",
      "sections.item:section_hero.image.id",
      "sections.item:section_rich_text.*",
      "sections.item:section_image_split.*",
      "sections.item:section_image_split.image.id",
      "sections.item:section_faq.*",
      "sections.item:section_feature_cards.*",
      "sections.item:section_feature_cards.items.*",
      "sections.item:section_feature_cards.items.icon.id",
    ].join(","),
    deep: JSON.stringify({ sections: { _sort: ["sort"] } }),
  });
  params.append("filter[app][_eq]", appName);

  slugs.forEach((slug, index) => params.append(`filter[_or][${index}][slug][_eq]`, slug));

  const res = await fetch(`${cfg.baseUrl}/items/pages?${params.toString()}`, {
    method: "GET",
    headers: {
      ...(cfg.token ? { Authorization: `Bearer ${cfg.token}` } : {}),
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  const payload = (await res.json()) as { data?: unknown };
  const pages = Array.isArray(payload.data) ? (payload.data as IlmPageRow[]) : [];
  if (!pages.length) return null;

  const bySlug = new Map<string, IlmPageRow>();
  for (const page of pages) {
    if (page.slug) bySlug.set(page.slug, page);
  }

  const homePage = bySlug.get("ilm-home");
  const aboutPage = bySlug.get("ilm-about");
  const howPage = bySlug.get("ilm-how-it-works");
  const pricingPage = bySlug.get("ilm-pricing");
  const faqPage = bySlug.get("ilm-faq");
  const resourcesPage = bySlug.get("ilm-resources");
  const signInPage = bySlug.get("ilm-sign-in");

  const homeHero = firstSection(homePage, "section_hero");
  const homeSplit = firstSection(homePage, "section_image_split");
  const homeCards = firstSection(homePage, "section_feature_cards");
  const howCards = firstSection(howPage, "section_feature_cards");
  const faqSection = firstSection(faqPage, "section_faq");
  const resourcesCards = firstSection(resourcesPage, "section_feature_cards");
  const signInHero = firstSection(signInPage, "section_hero");

  const mapped: Partial<IlmMarketingContent> = {
    heroTitle: asString(homeHero?.headline) ?? undefined,
    heroBody: asString(homeHero?.subheadline) ?? undefined,
    home: {
      ...ilmMarketingDefault.home,
      heroBackgroundImageUrl:
        fileRefToUrl(cfg.baseUrl, homeHero?.image) ?? ilmMarketingDefault.home.heroBackgroundImageUrl,
      primaryCta: {
        label: asString(homeHero?.cta_primary_label) ?? ilmMarketingDefault.home.primaryCta.label,
        href: asString(homeHero?.cta_primary_url) ?? ilmMarketingDefault.home.primaryCta.href,
      },
      secondaryCta: {
        label: asString(homeHero?.cta_secondary_label) ?? ilmMarketingDefault.home.secondaryCta.label,
        href: asString(homeHero?.cta_secondary_url) ?? ilmMarketingDefault.home.secondaryCta.href,
      },
      assistance: {
        ...ilmMarketingDefault.home.assistance,
        eyebrow: asString(homeSplit?.eyebrow) ?? ilmMarketingDefault.home.assistance.eyebrow,
        title: asString(homeSplit?.headline) ?? ilmMarketingDefault.home.assistance.title,
        body: asString(homeSplit?.body) ?? ilmMarketingDefault.home.assistance.body,
        sideImageUrl:
          fileRefToUrl(cfg.baseUrl, homeSplit?.image) ?? ilmMarketingDefault.home.assistance.sideImageUrl,
        primaryCta: {
          label: asString(homeSplit?.cta_label) ?? ilmMarketingDefault.home.assistance.primaryCta.label,
          href: asString(homeSplit?.cta_url) ?? ilmMarketingDefault.home.assistance.primaryCta.href,
        },
      },
      organisations: {
        ...ilmMarketingDefault.home.organisations,
        eyebrow: asString(homeCards?.eyebrow) ?? ilmMarketingDefault.home.organisations.eyebrow,
        title: asString(homeCards?.headline) ?? ilmMarketingDefault.home.organisations.title,
        body: asString(homeCards?.intro) ?? ilmMarketingDefault.home.organisations.body,
      },
    },
    about: {
      ...ilmMarketingDefault.about,
      title: asString(aboutPage?.title) ?? ilmMarketingDefault.about.title,
      body:
        asString(firstSection(aboutPage, "section_rich_text")?.body) ?? ilmMarketingDefault.about.body,
    },
    howItWorks: {
      ...ilmMarketingDefault.howItWorks,
      title: asString(howPage?.title) ?? ilmMarketingDefault.howItWorks.title,
      intro:
        asString(firstSection(howPage, "section_rich_text")?.body) ?? ilmMarketingDefault.howItWorks.intro,
    },
    pricing: {
      ...ilmMarketingDefault.pricing,
      title: asString(pricingPage?.title) ?? ilmMarketingDefault.pricing.title,
      intro:
        asString(firstSection(pricingPage, "section_rich_text")?.body) ?? ilmMarketingDefault.pricing.intro,
    },
    faq: {
      ...ilmMarketingDefault.faq,
      title: asString(faqPage?.title) ?? ilmMarketingDefault.faq.title,
      intro: asString(faqSection?.intro) ?? ilmMarketingDefault.faq.intro,
      items:
        Array.isArray(faqSection?.items) && faqSection?.items.length
          ? (faqSection.items as Array<Record<string, unknown>>)
              .map((it) => ({ q: asString(it.question), a: asString(it.answer) }))
              .filter((it): it is { q: string; a: string } => !!it.q && !!it.a)
          : ilmMarketingDefault.faq.items,
    },
    resources: {
      ...ilmMarketingDefault.resources,
      title: asString(resourcesPage?.title) ?? ilmMarketingDefault.resources.title,
      intro:
        asString(firstSection(resourcesPage, "section_rich_text")?.body) ??
        ilmMarketingDefault.resources.intro,
      cards:
        Array.isArray(resourcesCards?.items) && resourcesCards?.items.length
          ? (() => {
              const cards: IlmMarketingContent["resources"]["cards"] = [];
              for (const item of resourcesCards.items as Array<Record<string, unknown>>) {
                const title = asString(item.title);
                const body = asString(item.body);
                const url = asString(item.url);
                if (!title || !body) continue;
                cards.push({
                  title,
                  body,
                  cta: url ? { label: `Open ${title}`, href: url } : undefined,
                });
              }
              return cards.length ? cards : ilmMarketingDefault.resources.cards;
            })()
          : ilmMarketingDefault.resources.cards,
    },
    journey: {
      ...ilmMarketingDefault.journey,
      title: asString(howCards?.headline) ?? ilmMarketingDefault.journey.title,
      intro: asString(howCards?.intro) ?? ilmMarketingDefault.journey.intro,
      steps:
        Array.isArray(howCards?.items) && howCards?.items.length
          ? (() => {
              const steps: IlmMarketingContent["journey"]["steps"] = [];
              for (const [index, item] of (howCards.items as Array<Record<string, unknown>>).entries()) {
                const title = asString(item.title);
                const copy = asString(item.body);
                if (!title || !copy) continue;
                steps.push({
                  num: index + 1,
                  title,
                  copy,
                  href: asString(item.url) ?? ilmMarketingDefault.journey.steps[index]?.href ?? "/",
                  image:
                    fileRefToUrl(cfg.baseUrl, item.icon) ??
                    ilmMarketingDefault.journey.steps[index]?.image ??
                    ilmMarketingDefault.journey.steps[0].image,
                  alt:
                    asString(item.icon_alt) ??
                    ilmMarketingDefault.journey.steps[index]?.alt ??
                    ilmMarketingDefault.journey.steps[0].alt,
                });
              }
              return steps.length ? steps : ilmMarketingDefault.journey.steps;
            })()
          : ilmMarketingDefault.journey.steps,
    },
    signIn: {
      ...ilmMarketingDefault.signIn,
      panelImageUrl:
        fileRefToUrl(cfg.baseUrl, signInHero?.image) ?? ilmMarketingDefault.signIn.panelImageUrl,
      quote: asString(signInHero?.headline) ?? ilmMarketingDefault.signIn.quote,
    },
  };

  return mapped;
}

/**
 * Returns marketing content for ILM. Always returns something (local fallback)
 * so deploys are not blocked on CMS configuration.
 *
 * Directus integration is intentionally thin: if configured, it attempts to fetch
 * a single-item JSON payload. If it fails, we fall back to defaults.
 */
export async function getIlmMarketingContent(): Promise<IlmMarketingContent> {
  const cfg = getDirectusConfig();
  if (!cfg) return ilmMarketingDefault;

  // Prefer structured pages migration source when available.
  const structured = await getStructuredPagesContent(cfg).catch(() => null);
  if (structured) {
    return deepMerge(ilmMarketingDefault, structured) as IlmMarketingContent;
  }

  // Singleton fallback (legacy setup).
  const path = process.env.ILM_MARKETING_DIRECTUS_PATH?.trim() || "/items/ilm_marketing";

  try {
    const res = await directusGetJson<{ data?: unknown }>(path);
    const data = res && typeof res === "object" && "data" in res ? (res as { data?: unknown }).data : undefined;
    if (!data || typeof data !== "object") return ilmMarketingDefault;

    // Keep this permissive so Directus fields can evolve while preserving defaults.
    return deepMerge(ilmMarketingDefault, data) as IlmMarketingContent;
  } catch {
    return ilmMarketingDefault;
  }
}

