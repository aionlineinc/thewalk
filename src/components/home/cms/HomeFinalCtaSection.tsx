/**
 * Home final CTA banner — CMS adapter for `section_cta_banner`.
 *
 * Renders the exact original JSX in `src/app/page.tsx` (light gray bg). We
 * intentionally ignore `variant` and `background_image` here because the
 * home final CTA has a fixed visual treatment.
 */
import { AppPillLink } from "@/components/ui/AppPillLink";
import { AppHeadingPromo } from "@/components/ui/Typography";
import { type Section } from "@/lib/cms";

type CtaSection = Extract<Section, { __collection: "section_cta_banner" }>;

export function HomeFinalCtaSection({ section }: { section: CtaSection; index: number }) {
  return (
    <section
      id="home-final-cta"
      className="border-t border-gray-100 bg-gray-50 py-24 text-center md:py-32"
      aria-labelledby="home-final-cta-heading"
    >
      <div className="container mx-auto max-w-3xl px-4">
        <AppHeadingPromo id="home-final-cta-heading" className="mb-6">
          {section.headline}
        </AppHeadingPromo>
        {section.body ? (
          <p
            id="home-final-cta-body"
            className="mb-10 text-xl font-light text-gray-500 md:text-2xl"
          >
            {section.body}
          </p>
        ) : null}
        <div id="home-final-cta-actions" className="flex justify-center">
          <AppPillLink href={section.cta_url} variant="primaryLarge">
            {section.cta_label}
          </AppPillLink>
        </div>
      </div>
    </section>
  );
}
