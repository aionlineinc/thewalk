import { Suspense } from "react";

import { PathwayAboutSection } from "@/components/journey/cms/PathwayAboutSection";
import { PathwayHeroSection } from "@/components/journey/cms/PathwayHeroSection";
import { PathwayMinistryTabsSection } from "@/components/journey/cms/PathwayMinistryTabsSection";
import type { Page, Section } from "@/lib/cms/schemas";

type PathwayHero = Extract<Section, { __collection: "section_pathway_hero" }>;
type PathwayAbout = Extract<Section, { __collection: "section_pathway_about" }>;
type MinistryTabs = Extract<
  Section,
  { __collection: "section_ministry_tabs" }
>;

interface Props {
  /** The CMS page row, or null when unavailable. */
  page: Page | null;
  /** Slug used purely for stable element ids (e.g. "cross-over"). */
  slug: string;
  /** Hardcoded fallback rendered when CMS data is missing/invalid. */
  fallback: React.ReactNode;
}

function findSection<T extends Section>(
  sections: Section[] | undefined,
  collection: T["__collection"],
): T | null {
  if (!sections) return null;
  for (const s of sections) {
    if (s.__collection === collection) return s as T;
  }
  return null;
}

/**
 * Render a /journey/cross-* pathway page from CMS data.
 *
 * Contract:
 *   - The page MUST have at least a `section_pathway_hero` to use CMS rendering;
 *     otherwise we render the hardcoded fallback so the page never appears
 *     empty.
 *   - `section_pathway_about` and `section_ministry_tabs` are optional but
 *     normally always present.
 *   - Other unknown section types coming from the CMS are intentionally
 *     ignored on this route (other routes own them).
 */
export function PathwayPageRenderer({ page, slug, fallback }: Props) {
  const hero = findSection<PathwayHero>(page?.sections, "section_pathway_hero");
  if (!hero) {
    return <>{fallback}</>;
  }
  const about = findSection<PathwayAbout>(
    page?.sections,
    "section_pathway_about",
  );
  const tabs = findSection<MinistryTabs>(
    page?.sections,
    "section_ministry_tabs",
  );

  const heroSectionId = `${slug}-hero`;
  const heroTitleId = `${heroSectionId}-title`;
  const aboutSectionId = `${slug}-about`;
  const aboutHeadingId = `${aboutSectionId}-heading`;

  return (
    <>
      <PathwayHeroSection
        section={hero}
        sectionId={heroSectionId}
        titleId={heroTitleId}
      />
      {about && (
        <PathwayAboutSection
          section={about}
          sectionId={aboutSectionId}
          headingId={aboutHeadingId}
        />
      )}
      {tabs && (
        <Suspense fallback={null}>
          <PathwayMinistryTabsSection
            section={tabs}
            anchorId={tabs.section_anchor ?? `${slug}-ministries`}
          />
        </Suspense>
      )}
    </>
  );
}
