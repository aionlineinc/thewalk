/**
 * Zod schemas for all CMS content.
 *
 * Each `section_*` collection has its own schema. Sections are discriminated
 * by `__collection` (which we derive from the M2A junction's `collection`
 * field when fetching). A section that fails validation is dropped from
 * the rendered page (see `parseSections` in ./fetch.ts) so one broken row
 * cannot break the whole page.
 */
import { z } from "zod";

/* ─── primitives ────────────────────────────────────────────────────────── */

/** A Directus file reference: either a UUID string or an expanded object. */
export const FileRefSchema = z
  .union([
    z.string().min(1),
    z
      .object({
        id: z.string().min(1),
        filename_disk: z.string().nullable().optional(),
        filename_download: z.string().nullable().optional(),
        title: z.string().nullable().optional(),
        width: z.number().nullable().optional(),
        height: z.number().nullable().optional(),
        type: z.string().nullable().optional(),
      })
      .passthrough(),
  ])
  .nullable()
  .optional();
export type FileRef = z.infer<typeof FileRefSchema>;

const StringOpt = z.string().nullable().optional();
const TextOpt = z.string().nullable().optional();
const UrlOpt = z.string().nullable().optional();
/**
 * Image alt text. Empty string is allowed (and meaningful) for purely
 * decorative images per WCAG 1.1.1. Editors who omit alt entirely also
 * resolve to "" so consumers never have to guard against null.
 */
const AltText = z
  .string()
  .nullable()
  .optional()
  .transform((v) => v ?? "");

const BaseSection = z.object({
  id: z.string(),
  status: z.string().default("published"),
  title_internal: StringOpt,
});

/* ─── section schemas ───────────────────────────────────────────────────── */

export const SectionHeroSchema = BaseSection.extend({
  __collection: z.literal("section_hero"),
  eyebrow: StringOpt,
  headline: z.string().min(1),
  subheadline: TextOpt,
  image: FileRefSchema,
  image_alt: AltText,
  image_position: z.enum(["left", "right", "full", "background"]).nullable().optional().default("right"),
  cta_primary_label: StringOpt,
  cta_primary_url: UrlOpt,
  cta_secondary_label: StringOpt,
  cta_secondary_url: UrlOpt,
});

export const SectionRichTextSchema = BaseSection.extend({
  __collection: z.literal("section_rich_text"),
  eyebrow: StringOpt,
  headline: StringOpt,
  body: z.string().min(1),
  alignment: z.enum(["left", "center"]).nullable().optional().default("left"),
  /**
   * If true, render in the "reversed" editorial split layout (heading on the
   * right, body on the left). Otherwise render the default stacked block.
   * Consumers may ignore this for sections that aren't using an editorial-split
   * adapter.
   */
  reversed: z.boolean().nullable().optional().default(false),
});

export const FeatureCardItemSchema = z.object({
  id: z.string(),
  sort: z.number().nullable().optional(),
  title: z.string().min(1),
  body: TextOpt,
  icon: FileRefSchema,
  icon_alt: StringOpt,
  url: UrlOpt,
});

export const SectionFeatureCardsSchema = BaseSection.extend({
  __collection: z.literal("section_feature_cards"),
  eyebrow: StringOpt,
  headline: StringOpt,
  intro: TextOpt,
  columns: z.enum(["2", "3", "4"]).nullable().optional().default("3"),
  items: z.array(FeatureCardItemSchema).default([]),
});

export const SectionImageSplitSchema = BaseSection.extend({
  __collection: z.literal("section_image_split"),
  eyebrow: StringOpt,
  headline: z.string().min(1),
  body: TextOpt,
  image: FileRefSchema,
  image_alt: AltText,
  image_side: z.enum(["left", "right"]).nullable().optional().default("right"),
  cta_label: StringOpt,
  cta_url: UrlOpt,
});

export const StatItemSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

export const SectionStatsSchema = BaseSection.extend({
  __collection: z.literal("section_stats"),
  eyebrow: StringOpt,
  headline: StringOpt,
  items: z.array(StatItemSchema).nullable().optional().default([]),
});

export const MinistryTabFocusItemSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

export const MinistryTabSchema = z.object({
  id: z.string(),
  sort: z.number().nullable().optional(),
  /** URL slug used by `?tab=…`. Optional — adapter falls back to slugified label. */
  key: StringOpt,
  label: z.string().min(1),
  title: z.string().min(1),
  body: TextOpt,
  /** Long ministry description rendered above the focus list (paragraphs split on blank lines). */
  lede: TextOpt,
  /** Bullet-style focus list rendered inside the active tab. */
  focus_items: z.array(MinistryTabFocusItemSchema).nullable().optional().default([]),
  /** Comma-separated bible references shown in the "Key scriptures" panel. */
  scriptures: StringOpt,
  image: FileRefSchema,
  image_alt: StringOpt,
  cta_label: StringOpt,
  cta_url: UrlOpt,
});

export const SectionMinistryTabsSchema = BaseSection.extend({
  __collection: z.literal("section_ministry_tabs"),
  eyebrow: StringOpt,
  headline: StringOpt,
  intro: TextOpt,
  /** In-page anchor id used by sticky nav and `?tab=…` deep-links. */
  section_anchor: StringOpt,
  tabs: z.array(MinistryTabSchema).default([]),
});

export const SectionCtaBannerSchema = BaseSection.extend({
  __collection: z.literal("section_cta_banner"),
  eyebrow: StringOpt,
  headline: z.string().min(1),
  body: TextOpt,
  cta_label: z.string().min(1),
  cta_url: z.string().min(1),
  background_image: FileRefSchema,
  background_alt: StringOpt,
  variant: z.enum(["light", "dark", "brand"]).nullable().optional().default("brand"),
});

export const TimelineItemSchema = z.object({
  id: z.string(),
  sort: z.number().nullable().optional(),
  date_label: z.string().min(1),
  title: z.string().min(1),
  body: TextOpt,
  image: FileRefSchema,
  image_alt: StringOpt,
});

export const SectionTimelineSchema = BaseSection.extend({
  __collection: z.literal("section_timeline"),
  eyebrow: StringOpt,
  headline: StringOpt,
  intro: TextOpt,
  items: z.array(TimelineItemSchema).default([]),
});

export const FaqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const SectionFaqSchema = BaseSection.extend({
  __collection: z.literal("section_faq"),
  eyebrow: StringOpt,
  headline: StringOpt,
  intro: TextOpt,
  items: z.array(FaqItemSchema).nullable().optional().default([]),
});

export const TestimonialItemSchema = z.object({
  id: z.string(),
  sort: z.number().nullable().optional(),
  quote: z.string().min(1),
  name: z.string().min(1),
  role: StringOpt,
  image: FileRefSchema,
  image_alt: StringOpt,
});

export const SectionTestimonialsSchema = BaseSection.extend({
  __collection: z.literal("section_testimonials"),
  eyebrow: StringOpt,
  headline: StringOpt,
  layout: z.enum(["carousel", "grid"]).nullable().optional().default("grid"),
  items: z.array(TestimonialItemSchema).default([]),
});

export const GalleryItemSchema = z.object({
  id: z.string(),
  sort: z.number().nullable().optional(),
  image: FileRefSchema,
  image_alt: AltText,
  caption: StringOpt,
});

export const SectionGallerySchema = BaseSection.extend({
  __collection: z.literal("section_gallery"),
  eyebrow: StringOpt,
  headline: StringOpt,
  layout: z.enum(["grid-2", "grid-3", "grid-4", "masonry"]).nullable().optional().default("grid-3"),
  items: z.array(GalleryItemSchema).default([]),
});

export const LogoStripItemSchema = z.object({
  id: z.string(),
  sort: z.number().nullable().optional(),
  logo: FileRefSchema,
  alt: AltText,
  url: UrlOpt,
});

export const SectionLogoStripSchema = BaseSection.extend({
  __collection: z.literal("section_logo_strip"),
  eyebrow: StringOpt,
  headline: StringOpt,
  items: z.array(LogoStripItemSchema).default([]),
});

export const DoctrineBlockItemSchema = z.object({
  id: z.string(),
  sort: z.number().nullable().optional(),
  title: z.string().min(1),
  body: TextOpt,
  scripture_refs: StringOpt,
});

/**
 * A long-form theological / structural block: headline + optional
 * subheadline + body + comma-separated scripture refs, with optional
 * nested sub-points (e.g. the Members section on /about/beliefs).
 */
export const SectionDoctrineBlockSchema = BaseSection.extend({
  __collection: z.literal("section_doctrine_block"),
  eyebrow: StringOpt,
  headline: StringOpt,
  subheadline: StringOpt,
  body: TextOpt,
  scripture_refs: StringOpt,
  variant: z.enum(["default", "muted-panel"]).nullable().optional().default("default"),
  items: z.array(DoctrineBlockItemSchema).nullable().optional().default([]),
});

export const PrinciplesPanelItemSchema = z.object({
  id: z.string(),
  sort: z.number().nullable().optional(),
  title: z.string().min(1),
  body: TextOpt,
  scripture_refs: StringOpt,
});

/**
 * Image-left + side-panel-of-principles layout, used by the Ministry
 * Structure hero (diagram next to a stack of named principles, each
 * with optional scripture refs).
 */
export const SectionPrinciplesPanelSchema = BaseSection.extend({
  __collection: z.literal("section_principles_panel"),
  eyebrow: StringOpt,
  headline: z.string().min(1),
  subheadline: TextOpt,
  image: FileRefSchema,
  image_alt: AltText,
  items: z.array(PrinciplesPanelItemSchema).default([]),
});

/**
 * Photographic, dark-overlay hero used by /journey/cross-* pathway pages.
 * The visual treatment (rounded full-bleed image, glass-blur card with
 * eyebrow + chips + footnote) is fixed in the adapter; only the content
 * comes from CMS.
 */
export const SectionPathwayHeroSchema = BaseSection.extend({
  __collection: z.literal("section_pathway_hero"),
  eyebrow: StringOpt,
  headline: z.string().min(1),
  subheadline: TextOpt,
  /** Comma-separated list of chip labels rendered as pills under the subhead. */
  chips_csv: StringOpt,
  cta_primary_label: StringOpt,
  cta_primary_url: UrlOpt,
  back_link_label: StringOpt,
  back_link_url: UrlOpt,
  footnote: TextOpt,
  image: FileRefSchema,
  image_alt: AltText,
});

export const PathwayAboutItemSchema = z.object({
  id: z.string(),
  sort: z.number().nullable().optional(),
  title: z.string().min(1),
  body: TextOpt,
});

/**
 * Two-column About block: title + lede left, stacked mini focus cards
 * right (with optional CTA buttons under the cards).
 */
export const SectionPathwayAboutSchema = BaseSection.extend({
  __collection: z.literal("section_pathway_about"),
  eyebrow: StringOpt,
  headline: z.string().min(1),
  lede: TextOpt,
  cta_primary_label: StringOpt,
  cta_primary_url: UrlOpt,
  cta_secondary_label: StringOpt,
  cta_secondary_url: UrlOpt,
  items: z.array(PathwayAboutItemSchema).default([]),
});

export const JourneyScrollerSlideSchema = z.object({
  id: z.string(),
  sort: z.number().nullable().optional(),
  /** Stable React key. Adapter falls back to slugified label when empty. */
  key: StringOpt,
  label: z.string().min(1),
  /**
   * Optional small uppercase label above the title. When omitted the
   * adapter computes a sensible default ("Journey overview" on the first
   * slide; "Pathway 0X" on subsequent slides).
   */
  eyebrow: StringOpt,
  title: z.string().min(1),
  body: TextOpt,
  href: UrlOpt,
  cta_label: StringOpt,
  /** Comma-separated ministry pill labels. Each links to `${href}#ministries`. */
  ministries_csv: StringOpt,
  image: FileRefSchema,
  image_alt: AltText,
});

/**
 * Sticky scroll-driven 4-up overview used by /journey. The mechanics
 * (sticky stack, scroll progress mapping, right-side numbered nav,
 * reduced-motion handling) are owned by the `JourneyImmersiveScroller`
 * client component; the CMS only supplies copy + images + links.
 */
export const SectionJourneyScrollerSchema = BaseSection.extend({
  __collection: z.literal("section_journey_scroller"),
  /** In-page anchor id. Defaults to "journey-immersive". */
  section_anchor: StringOpt,
  /** Aria label for the section. Defaults to "Journey overview". */
  aria_label: StringOpt,
  slides: z.array(JourneyScrollerSlideSchema).default([]),
});

/* ─── discriminated union ───────────────────────────────────────────────── */

export const SectionSchema = z.discriminatedUnion("__collection", [
  SectionHeroSchema,
  SectionRichTextSchema,
  SectionFeatureCardsSchema,
  SectionImageSplitSchema,
  SectionStatsSchema,
  SectionMinistryTabsSchema,
  SectionCtaBannerSchema,
  SectionTimelineSchema,
  SectionFaqSchema,
  SectionTestimonialsSchema,
  SectionGallerySchema,
  SectionLogoStripSchema,
  SectionDoctrineBlockSchema,
  SectionPrinciplesPanelSchema,
  SectionPathwayHeroSchema,
  SectionPathwayAboutSchema,
  SectionJourneyScrollerSchema,
]);

export type Section = z.infer<typeof SectionSchema>;
export type SectionCollection = Section["__collection"];

/** The list of all section collection names — kept in sync with the schema union. */
export const SECTION_COLLECTIONS = [
  "section_hero",
  "section_rich_text",
  "section_feature_cards",
  "section_image_split",
  "section_stats",
  "section_ministry_tabs",
  "section_cta_banner",
  "section_timeline",
  "section_faq",
  "section_testimonials",
  "section_gallery",
  "section_logo_strip",
  "section_doctrine_block",
  "section_principles_panel",
  "section_pathway_hero",
  "section_pathway_about",
  "section_journey_scroller",
] as const satisfies readonly SectionCollection[];

/* ─── page + site settings ──────────────────────────────────────────────── */

/** Find the first section of a given collection on a page. */
export function findSection<K extends Section["__collection"]>(
  sections: Section[] | undefined | null,
  collection: K,
): Extract<Section, { __collection: K }> | null {
  if (!sections) return null;
  const found = sections.find((s) => s.__collection === collection);
  return (found ?? null) as Extract<Section, { __collection: K }> | null;
}

export const PageSchema = z.object({
  id: z.string(),
  status: z.string(),
  slug: z.string().min(1),
  title: z.string().min(1),
  seo_title: StringOpt,
  seo_description: TextOpt,
  seo_image: FileRefSchema,
  sections: z.array(SectionSchema).default([]),
});
export type Page = z.infer<typeof PageSchema>;

export const SiteSettingsSchema = z.object({
  nav_logo: FileRefSchema,
  nav_logo_alt: StringOpt,
  footer_logo: FileRefSchema,
  footer_logo_alt: StringOpt,
  default_og_image: FileRefSchema,
  default_seo_title: StringOpt,
  default_seo_description: TextOpt,
  social_instagram: StringOpt,
  social_facebook: StringOpt,
  social_youtube: StringOpt,
  social_tiktok: StringOpt,
  contact_email: StringOpt,
  contact_phone: StringOpt,
  contact_address: TextOpt,
});
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
