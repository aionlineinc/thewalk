/**
 * About hero — CMS adapter.
 *
 * Renders the EXACT same JSX as `AboutPremiumHero` in
 * `src/components/sections/AboutPremiumHero.tsx`, sourced from a `section_hero`
 * row. Visual structure (gradient card, masked right-image well, two CTAs) must
 * stay in sync with the hardcoded fallback in `src/app/about/page.tsx`.
 */
import Image from "next/image";

import { AppPillLink } from "@/components/ui/AppPillLink";
import { AppHeadingDisplay, AppLeadOnDark } from "@/components/ui/Typography";
import { cmsAssetPresets, type Section } from "@/lib/cms";

type HeroSection = Extract<Section, { __collection: "section_hero" }>;

export function AboutHeroSection({ section }: { section: HeroSection; index: number }) {
  const src = cmsAssetPresets.heroFull(section.image);
  return (
    <section
      id="about-hero"
      className="relative w-full px-2 pb-8 pt-1 font-sans tracking-tight md:px-4 md:pb-12 md:pt-2"
      aria-labelledby="about-hero-title"
    >
      <div className="relative flex w-full flex-wrap overflow-hidden rounded-[20px] bg-gradient-to-br from-[#081a2d] via-[#0b2a46] to-[#04080f] shadow-xl">
        <div className="relative mx-auto h-[600px] min-h-[600px] w-[1017px] max-w-full text-center">
          {src ? (
            <div
              className="absolute bottom-0 right-0 top-[75px] z-[1] w-[36%] min-w-[10rem] bg-transparent sm:w-[38%] md:w-[42%] lg:w-[44%] [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.2)_10%,rgba(0,0,0,0.78)_26%,black_40%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.2)_10%,rgba(0,0,0,0.78)_26%,black_40%)]"
            >
              <Image
                src={src}
                alt={section.image_alt ?? ""}
                fill
                priority
                sizes="(max-width: 768px) 42vw, 38vw"
                className="origin-right scale-[0.88] bg-transparent object-contain object-center object-right p-4 md:p-6"
              />
            </div>
          ) : null}

          <div className="relative z-[2] flex h-full min-h-[600px] flex-col justify-center px-6 py-8 md:px-10 md:py-10 lg:px-12">
            <div className="relative z-[3] w-full max-w-[min(36rem,calc(100%-max(10.5rem,38%)))] sm:max-w-[min(38rem,calc(100%-max(11rem,40%)))] md:max-w-[min(40rem,calc(100%-max(12rem,44%)))] lg:max-w-[min(42rem,calc(100%-max(13rem,46%)))]">
              <AppHeadingDisplay variant="about" id="about-hero-title" className="mb-6 text-left">
                {section.headline}
              </AppHeadingDisplay>
              {section.subheadline ? (
                <AppLeadOnDark id="about-hero-description" className="mb-8 max-w-xl text-left">
                  {section.subheadline}
                </AppLeadOnDark>
              ) : null}
              {section.cta_primary_label || section.cta_secondary_label ? (
                <div id="about-hero-actions" className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                  {section.cta_primary_label && section.cta_primary_url ? (
                    <AppPillLink href={section.cta_primary_url} variant="primary">
                      {section.cta_primary_label}
                      <svg
                        className="h-5 w-5"
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
          </div>
        </div>
      </div>
    </section>
  );
}
