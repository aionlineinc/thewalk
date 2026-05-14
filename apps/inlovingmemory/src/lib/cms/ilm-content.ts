import { ilmMarketingDefault, type IlmMarketingContent, type IlmMarketingLink } from "@/content/ilm-marketing.default";
import { directusGetJson, getDirectusConfig, cmsAssetUrl, ilmAssetPresets } from "@/lib/cms/directus-client";

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

function sectionsOf(page: IlmPageRow | undefined, collection: string): Record<string, unknown>[] {
  if (!page?.sections || !Array.isArray(page.sections)) return [];
  return [...page.sections]
    .filter((row) => row.collection === collection && isPlainObject(row.item))
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((row) => row.item as Record<string, unknown>);
}

function firstSection(page: IlmPageRow | undefined, collection: string): Record<string, unknown> | null {
  const rows = sectionsOf(page, collection);
  return rows[0] ?? null;
}

function pickFeatureCardsSection(
  page: IlmPageRow | undefined,
  keyword: string,
): Record<string, unknown> | null {
  const rows = sectionsOf(page, "section_feature_cards");
  const lowered = keyword.toLowerCase();
  return (
    rows.find((row) => (asString(row.title_internal) ?? "").toLowerCase().includes(lowered)) ?? null
  );
}

function pickRichTextSection(
  page: IlmPageRow | undefined,
  keyword: string,
): Record<string, unknown> | null {
  const rows = sectionsOf(page, "section_rich_text");
  const lowered = keyword.toLowerCase();
  return (
    rows.find((row) => (asString(row.title_internal) ?? "").toLowerCase().includes(lowered)) ?? null
  );
}

function heroCtasFromSection(
  hero: Record<string, unknown> | null,
): IlmMarketingContent["about"]["heroCtas"] {
  if (!hero) return undefined;
  const ctas: IlmMarketingLink[] = [];
  const label1 = asString(hero.cta_primary_label);
  const url1 = asString(hero.cta_primary_url);
  if (label1 && url1) ctas.push({ label: label1, href: url1 });
  const label2 = asString(hero.cta_secondary_label);
  const url2 = asString(hero.cta_secondary_url);
  if (label2 && url2) ctas.push({ label: label2, href: url2 });
  return ctas.length ? ctas : undefined;
}

function fileRefToUrl(baseUrl: string, fileRef: unknown): string | null {
  return cmsAssetUrl(baseUrl, fileRef, ilmAssetPresets.hero);
}

function fileRefToCardUrl(baseUrl: string, fileRef: unknown): string | null {
  return cmsAssetUrl(baseUrl, fileRef, ilmAssetPresets.card);
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
  params.append("filter[status][_eq]", "published");

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
  const homeIntro = pickRichTextSection(homePage, "hero") ?? firstSection(homePage, "section_rich_text");
  const homeAssistanceText = pickRichTextSection(homePage, "assistance");
  const homeSplit = firstSection(homePage, "section_image_split");
  const homeCardsJourney = pickFeatureCardsSection(homePage, "journey") ?? firstSection(homePage, "section_feature_cards");
  const homeCardsOrganisations = pickFeatureCardsSection(homePage, "organisation");
  const aboutHero = firstSection(aboutPage, "section_hero");
  const howHero = firstSection(howPage, "section_hero");
  const pricingHero = firstSection(pricingPage, "section_hero");
  const faqHero = firstSection(faqPage, "section_hero");
  const resourcesHero = firstSection(resourcesPage, "section_hero");
  const howCards = firstSection(howPage, "section_feature_cards");
  const faqSection = firstSection(faqPage, "section_faq");
  const resourcesCards = firstSection(resourcesPage, "section_feature_cards");
  const signInHero = firstSection(signInPage, "section_hero");
  const signInIntro = firstSection(signInPage, "section_rich_text");

  const mapped: Partial<IlmMarketingContent> = {
    heroTitle: asString(homeHero?.headline) ?? asString(homeIntro?.headline) ?? undefined,
    heroBody: asString(homeHero?.subheadline) ?? asString(homeIntro?.body) ?? undefined,
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
        eyebrow:
          asString(homeSplit?.eyebrow) ??
          asString(homeAssistanceText?.eyebrow) ??
          ilmMarketingDefault.home.assistance.eyebrow,
        title:
          asString(homeSplit?.headline) ??
          asString(homeAssistanceText?.headline) ??
          ilmMarketingDefault.home.assistance.title,
        body:
          asString(homeSplit?.body) ??
          asString(homeAssistanceText?.body) ??
          ilmMarketingDefault.home.assistance.body,
        backgroundImageUrl:
          fileRefToUrl(cfg.baseUrl, homeSplit?.image) ??
          ilmMarketingDefault.home.assistance.backgroundImageUrl,
        sideImageUrl:
          fileRefToUrl(cfg.baseUrl, homeSplit?.image) ?? ilmMarketingDefault.home.assistance.sideImageUrl,
        primaryCta: {
          label: asString(homeSplit?.cta_label) ?? ilmMarketingDefault.home.assistance.primaryCta.label,
          href: asString(homeSplit?.cta_url) ?? ilmMarketingDefault.home.assistance.primaryCta.href,
        },
      },
      organisations: {
        ...ilmMarketingDefault.home.organisations,
        eyebrow:
          asString(homeCardsOrganisations?.eyebrow) ?? ilmMarketingDefault.home.organisations.eyebrow,
        title: asString(homeCardsOrganisations?.headline) ?? ilmMarketingDefault.home.organisations.title,
        body: asString(homeCardsOrganisations?.intro) ?? ilmMarketingDefault.home.organisations.body,
      },
    },
    about: {
      ...ilmMarketingDefault.about,
      title: asString(aboutPage?.title) ?? ilmMarketingDefault.about.title,
      body:
        asString(firstSection(aboutPage, "section_rich_text")?.body) ?? ilmMarketingDefault.about.body,
      heroEyebrow: asString(aboutHero?.eyebrow) ?? ilmMarketingDefault.about.heroEyebrow,
      heroImage: fileRefToUrl(cfg.baseUrl, aboutHero?.image) ?? ilmMarketingDefault.about.heroImage,
      heroCtas: heroCtasFromSection(aboutHero) ?? ilmMarketingDefault.about.heroCtas,
    },
    howItWorks: {
      ...ilmMarketingDefault.howItWorks,
      title: asString(howPage?.title) ?? ilmMarketingDefault.howItWorks.title,
      intro:
        asString(firstSection(howPage, "section_rich_text")?.body) ?? ilmMarketingDefault.howItWorks.intro,
      heroEyebrow: asString(howHero?.eyebrow) ?? ilmMarketingDefault.howItWorks.heroEyebrow,
      heroImage: fileRefToUrl(cfg.baseUrl, howHero?.image) ?? ilmMarketingDefault.howItWorks.heroImage,
      heroCtas: heroCtasFromSection(howHero) ?? ilmMarketingDefault.howItWorks.heroCtas,
    },
    pricing: {
      ...ilmMarketingDefault.pricing,
      title: asString(pricingPage?.title) ?? ilmMarketingDefault.pricing.title,
      intro:
        asString(firstSection(pricingPage, "section_rich_text")?.body) ?? ilmMarketingDefault.pricing.intro,
      heroEyebrow: asString(pricingHero?.eyebrow) ?? ilmMarketingDefault.pricing.heroEyebrow,
      heroImage: fileRefToUrl(cfg.baseUrl, pricingHero?.image) ?? ilmMarketingDefault.pricing.heroImage,
      heroCtas: heroCtasFromSection(pricingHero) ?? ilmMarketingDefault.pricing.heroCtas,
    },
    faq: {
      ...ilmMarketingDefault.faq,
      title: asString(faqPage?.title) ?? ilmMarketingDefault.faq.title,
      intro: asString(faqSection?.intro) ?? ilmMarketingDefault.faq.intro,
      heroEyebrow: asString(faqHero?.eyebrow) ?? ilmMarketingDefault.faq.heroEyebrow,
      heroImage: fileRefToUrl(cfg.baseUrl, faqHero?.image) ?? ilmMarketingDefault.faq.heroImage,
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
      heroEyebrow: asString(resourcesHero?.eyebrow) ?? ilmMarketingDefault.resources.heroEyebrow,
      heroImage:
        fileRefToUrl(cfg.baseUrl, resourcesHero?.image) ?? ilmMarketingDefault.resources.heroImage,
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
      title: asString(homeCardsJourney?.headline) ?? asString(howCards?.headline) ?? ilmMarketingDefault.journey.title,
      intro: asString(homeCardsJourney?.intro) ?? asString(howCards?.intro) ?? ilmMarketingDefault.journey.intro,
      steps:
        Array.isArray(homeCardsJourney?.items) && homeCardsJourney?.items.length
          ? (() => {
              const steps: IlmMarketingContent["journey"]["steps"] = [];
              for (const [index, item] of (homeCardsJourney.items as Array<Record<string, unknown>>)
                .slice(0, 3)
                .entries()) {
                const title = asString(item.title);
                const copy = asString(item.body);
                if (!title || !copy) continue;
                steps.push({
                  num: index + 1,
                  title,
                  copy,
                  href: asString(item.url) ?? ilmMarketingDefault.journey.steps[index]?.href ?? "/",
                  image:
                    fileRefToCardUrl(cfg.baseUrl, item.icon) ??
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
      quote: asString(signInHero?.headline) ?? asString(signInIntro?.headline) ?? ilmMarketingDefault.signIn.quote,
      formHeading: asString(signInIntro?.headline) ?? ilmMarketingDefault.signIn.formHeading,
      formBody: asString(signInIntro?.body) ?? ilmMarketingDefault.signIn.formBody,
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

