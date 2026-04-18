/**
 * About Servant Leadership Structure callout — CMS adapter for
 * `section_image_split`.
 *
 * Renders the EXACT JSX of the hardcoded callout: centered heading + body,
 * then a full-width muted band containing the diagram and a "Learn more"
 * pill linking to the dedicated structure page. `image_side` is intentionally
 * ignored (this slot has a fixed image-below layout).
 */
import Image from "next/image";

import { AppPillLink } from "@/components/ui/AppPillLink";
import { AppBody, AppHeadingEarthSection } from "@/components/ui/Typography";
import { cmsAssetPresets, type Section } from "@/lib/cms";

type ImageSplitSection = Extract<Section, { __collection: "section_image_split" }>;

export function AboutLeadershipCallout({
  section,
}: {
  section: ImageSplitSection;
  index: number;
}) {
  const src = cmsAssetPresets.diagram(section.image);
  return (
    <section
      id="about-leadership-structure"
      className="bg-background pb-20 pt-20"
      aria-labelledby="about-leadership-structure-heading"
    >
      <div className="container mx-auto max-w-content-wide px-4">
        <div className="mb-16 text-center">
          <AppHeadingEarthSection id="about-leadership-structure-heading" className="mb-6">
            {section.headline}
          </AppHeadingEarthSection>
          {section.body ? (
            <AppBody id="about-leadership-structure-body" className="mx-auto max-w-[600px]">
              {section.body}
            </AppBody>
          ) : null}
        </div>
      </div>
      <div
        id="about-leadership-structure-diagram"
        className="w-full border border-earth-100 bg-muted"
      >
        {src ? (
          <div className="relative h-[650px] w-full overflow-hidden">
            <Image
              src={src}
              alt={section.image_alt ?? ""}
              fill
              className="object-contain px-8 py-20"
              style={{ top: -1, left: 1, right: 0, bottom: 0 }}
              unoptimized
            />
          </div>
        ) : null}
        {section.cta_label && section.cta_url ? (
          <div className="mx-auto flex max-w-content-wide justify-center px-4 pb-10 pt-2">
            <AppPillLink href={section.cta_url} variant="outlineEarth">
              {section.cta_label}
            </AppPillLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
