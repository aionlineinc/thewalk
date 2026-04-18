/**
 * Generic CMS page renderer.
 *
 * Given an array of validated `Section`s (from `getPage().sections`), renders
 * each one using either a per-page override component or the default fallback.
 *
 * Design-stability rule: production pages SHOULD pass `overrides` that map each
 * section type to the page's existing visual component. The default renderers
 * are intentionally minimal — they exist so the pipeline never crashes, not
 * to drive the live site. If you see a default rendering in production, it
 * means a page is missing an override for that section type.
 */
import * as React from "react";

import type { Section, SectionCollection } from "@/lib/cms";
import {
  DefaultHero,
  DefaultRichText,
  DefaultFeatureCards,
  DefaultImageSplit,
  DefaultStats,
  DefaultMinistryTabs,
  DefaultCtaBanner,
  DefaultTimeline,
  DefaultFaq,
  DefaultTestimonials,
  DefaultGallery,
  DefaultLogoStrip,
} from "./sections";

/** Map of each section collection → React component accepting the full section. */
export type SectionComponentMap = {
  [K in SectionCollection]?: React.ComponentType<{
    section: Extract<Section, { __collection: K }>;
    /** Zero-based index within the page (useful for priority hints, first-hero logic, etc.). */
    index: number;
  }>;
};

const DEFAULT_RENDERERS = {
  section_hero: DefaultHero,
  section_rich_text: DefaultRichText,
  section_feature_cards: DefaultFeatureCards,
  section_image_split: DefaultImageSplit,
  section_stats: DefaultStats,
  section_ministry_tabs: DefaultMinistryTabs,
  section_cta_banner: DefaultCtaBanner,
  section_timeline: DefaultTimeline,
  section_faq: DefaultFaq,
  section_testimonials: DefaultTestimonials,
  section_gallery: DefaultGallery,
  section_logo_strip: DefaultLogoStrip,
} as const satisfies Required<SectionComponentMap>;

export interface PageRendererProps {
  sections: Section[];
  /** Per-page override components. Use to reuse an existing visual component. */
  overrides?: SectionComponentMap;
}

export function PageRenderer({ sections, overrides }: PageRendererProps) {
  return (
    <>
      {sections.map((section, index) => {
        const key = section.__collection;
        const OverrideComp = overrides?.[key] as
          | React.ComponentType<{ section: Section; index: number }>
          | undefined;
        const DefaultComp = DEFAULT_RENDERERS[key] as React.ComponentType<{
          section: Section;
          index: number;
        }>;
        const Comp = OverrideComp ?? DefaultComp;
        return (
          <Comp
            key={`${section.__collection}:${section.id}`}
            section={section}
            index={index}
          />
        );
      })}
    </>
  );
}
