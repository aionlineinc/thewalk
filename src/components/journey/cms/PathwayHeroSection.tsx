import Image from "next/image";
import Link from "next/link";

import { cmsAssetPresets } from "@/lib/cms/assets";
import type { Section } from "@/lib/cms/schemas";

type PathwayHero = Extract<Section, { __collection: "section_pathway_hero" }>;

interface Props {
  section: PathwayHero;
  /** Anchor id for the section element. */
  sectionId: string;
  /** Anchor id for the H1 (used by aria-labelledby). */
  titleId: string;
}

/**
 * Renders the dark, full-bleed hero used by every Cross Over / Roads /
 * Connect pathway page.
 *
 * The visual contract (rounded image card, glass-blur content card,
 * radial overlay, chip pills, footnote line below) is fixed in the JSX
 * so editors cannot accidentally drift the design. Only text + image +
 * links are CMS-driven.
 *
 * `chips_csv` is split on commas and trimmed.
 */
export function PathwayHeroSection({ section, sectionId, titleId }: Props) {
  const imageUrl = section.image
    ? cmsAssetPresets.heroFull(section.image)
    : null;
  const chips = (section.chips_csv ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  return (
    <section
      id={sectionId}
      className="border-b border-neutral-100 bg-white"
      aria-labelledby={titleId}
    >
      <div className="mx-auto w-full p-4">
        <div className="relative w-full overflow-hidden rounded-[20px] ring-1 ring-black/[0.06]">
          <div className="relative min-h-[520px] md:min-h-[600px]">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={section.image_alt}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            )}
            <div className="absolute inset-0 bg-neutral-950/55" aria-hidden />
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_20%_25%,rgba(255,255,255,0.14),transparent_55%)]"
              aria-hidden
            />
          </div>

          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto w-full max-w-6xl px-4 pb-6 md:px-8 md:pb-10">
              <div className="max-w-2xl rounded-[18px] border border-white/15 bg-black/35 p-6 backdrop-blur-md md:p-8">
                {section.eyebrow && (
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                    {section.eyebrow}
                  </p>
                )}
                <h1
                  id={titleId}
                  className="font-sans text-4xl font-normal leading-[1.04] tracking-tight text-white md:text-6xl"
                >
                  {section.headline}
                </h1>
                {section.subheadline && (
                  <p className="mt-4 text-base font-light leading-relaxed text-white/85 md:text-lg">
                    {section.subheadline}
                  </p>
                )}
                {chips.length > 0 && (
                  <div className="mt-7 flex flex-wrap gap-2">
                    {chips.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
                {(section.cta_primary_label || section.back_link_label) && (
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    {section.cta_primary_label && section.cta_primary_url && (
                      <Link
                        href={section.cta_primary_url}
                        data-button-link
                        className="inline-flex w-fit items-center justify-center rounded-full bg-red-soft px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/25 transition-colors hover:bg-red-soft-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                      >
                        {section.cta_primary_label}
                      </Link>
                    )}
                    {section.back_link_label && section.back_link_url && (
                      <Link
                        href={section.back_link_url}
                        className="text-sm font-medium text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                      >
                        {section.back_link_label}
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {section.footnote && (
                <p className="mt-6 max-w-3xl text-sm font-light leading-relaxed text-white/70 md:text-base">
                  {section.footnote}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
