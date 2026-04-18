import Link from "next/link";

import type { Section } from "@/lib/cms/schemas";

type PathwayAbout = Extract<Section, { __collection: "section_pathway_about" }>;

interface Props {
  section: PathwayAbout;
  /** Anchor id for the section element. */
  sectionId: string;
  /** Anchor id for the H2 (used by aria-labelledby). */
  headingId: string;
}

/**
 * Two-column "About" block used by every pathway page.
 *
 * Layout (title + lede left, stacked focus mini-cards + CTAs right) is
 * fixed in the JSX so editor changes only flow into copy and links.
 */
export function PathwayAboutSection({ section, sectionId, headingId }: Props) {
  return (
    <section
      id={sectionId}
      className="border-b border-earth-100 bg-white py-16 md:py-24"
      aria-labelledby={headingId}
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14">
          <div className="min-w-0">
            {section.eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-earth-500">
                {section.eyebrow}
              </p>
            )}
            <h2
              id={headingId}
              className="mt-4 font-sans text-4xl font-semibold tracking-tight text-earth-900 md:text-5xl"
            >
              {section.headline}
            </h2>
            {section.lede && (
              <p className="mt-6 max-w-xl text-[15px] font-light leading-relaxed text-muted-foreground md:text-lg">
                {section.lede}
              </p>
            )}
          </div>

          <div className="min-w-0">
            <div className="space-y-8">
              {section.items.map((item) => (
                <div key={item.id}>
                  <h3 className="text-base font-semibold tracking-tight text-earth-900 md:text-lg">
                    {item.title}
                  </h3>
                  {item.body && (
                    <p className="mt-2 text-base font-light leading-relaxed text-muted-foreground md:text-lg">
                      {item.body}
                    </p>
                  )}
                </div>
              ))}

              {(section.cta_primary_label || section.cta_secondary_label) && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {section.cta_primary_label && section.cta_primary_url && (
                    <Link
                      href={section.cta_primary_url}
                      data-button-link
                      className="inline-flex w-fit items-center justify-center rounded-full bg-red-soft px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/15 transition-colors hover:bg-red-soft-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/60"
                    >
                      {section.cta_primary_label}
                    </Link>
                  )}
                  {section.cta_secondary_label && section.cta_secondary_url && (
                    <Link
                      href={section.cta_secondary_url}
                      className="inline-flex w-fit items-center justify-center rounded-full border border-earth-200 bg-white px-6 py-3 text-sm font-medium text-earth-900 shadow-sm transition-colors hover:bg-earth-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/60"
                    >
                      {section.cta_secondary_label}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
