/**
 * Home hero — CMS adapter.
 *
 * Renders the EXACT same JSX as the original hardcoded hero in
 * `src/app/page.tsx`, just sourced from a `section_hero` CMS row instead of
 * inline strings. Do not change visual structure here without also updating
 * the `HardcodedHomeHero` fallback in `src/app/page.tsx` so they stay in sync.
 */
import Image from "next/image";
import * as React from "react";

import { AppPillLink } from "@/components/ui/AppPillLink";
import {
  AppHeadingDisplay,
  AppLeadOnDark,
} from "@/components/ui/Typography";
import { cmsAssetPresets, type Section } from "@/lib/cms";

type HeroSection = Extract<Section, { __collection: "section_hero" }>;

function renderMultilineHeadline(text: string): React.ReactNode {
  const parts = text.split("\n");
  return parts.flatMap((line, i) =>
    i < parts.length - 1
      ? [<React.Fragment key={`l-${i}`}>{line}</React.Fragment>, <br key={`br-${i}`} />]
      : [<React.Fragment key={`l-${i}`}>{line}</React.Fragment>],
  );
}

export function HomeHeroSection({ section }: { section: HeroSection; index: number }) {
  const src = cmsAssetPresets.heroFull(section.image);
  return (
    <section
      id="home-hero"
      className="relative flex h-[95vh] min-h-[600px] flex-col items-center justify-center p-2 font-sans tracking-tight md:p-4"
      aria-labelledby="home-hero-title"
    >
      <div className="absolute inset-2 overflow-hidden rounded-[20px] md:inset-4">
        {src ? (
          <div className="absolute inset-0">
            <Image
              src={src}
              alt={section.image_alt ?? ""}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, min(100vw, 1280px)"
            />
          </div>
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/45 to-black/20" />
        <div className="absolute bottom-0 right-0 h-full w-full bg-red-soft/20 mix-blend-overlay" />
      </div>

      <div className="relative z-10 mx-auto mt-12 flex max-w-4xl flex-col items-center px-4 text-center">
        <AppHeadingDisplay variant="home" id="home-hero-title" className="mb-6">
          {renderMultilineHeadline(section.headline)}
        </AppHeadingDisplay>
        {section.subheadline ? (
          <AppLeadOnDark id="home-hero-description" className="mx-auto mb-10 max-w-2xl">
            {section.subheadline}
          </AppLeadOnDark>
        ) : null}

        {section.cta_primary_label || section.cta_secondary_label ? (
          <div
            id="home-hero-actions"
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            {section.cta_primary_label && section.cta_primary_url ? (
              <AppPillLink href={section.cta_primary_url} variant="primary">
                {section.cta_primary_label}
                <svg
                  className="ml-1 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </AppPillLink>
            ) : null}
            {section.cta_secondary_label && section.cta_secondary_url ? (
              <AppPillLink href={section.cta_secondary_url} variant="ghostOnDark">
                {section.cta_secondary_label}
              </AppPillLink>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
