import { AppBodyMuted, AppHeadingSection } from "@/components/ui/Typography";

type EditorialSplitBlockProps = {
  headline: string;
  body: string;
  reversed?: boolean;
  /** Landmark / fragment anchor for the section */
  sectionId?: string;
  /** Anchor and `aria-labelledby` target for the headline */
  headingId?: string;
  /** Id for the body copy paragraph */
  bodyId?: string;
};

export function EditorialSplitBlock({
  headline,
  body,
  reversed = false,
  sectionId,
  headingId,
  bodyId,
}: EditorialSplitBlockProps) {
  if (reversed) {
    return (
      <section
        id={sectionId}
        className="border-b border-gray-100 bg-white py-20 md:py-24"
        aria-labelledby={headingId}
      >
        <div className="container mx-auto grid max-w-content grid-cols-1 gap-8 px-4 md:grid-cols-2 md:gap-12">
          <AppHeadingSection id={headingId} className="md:order-2">
            {headline}
          </AppHeadingSection>
          <AppBodyMuted id={bodyId} className="md:order-1">
            {body}
          </AppBodyMuted>
        </div>
      </section>
    );
  }

  return (
    <section
      id={sectionId}
      className="border-b border-gray-100 bg-white py-20 md:py-24"
      aria-labelledby={headingId}
    >
      <div className="container mx-auto max-w-content px-4">
        <AppHeadingSection id={headingId}>{headline}</AppHeadingSection>
        <AppBodyMuted id={bodyId} className="mt-4 md:mt-6">
          {body}
        </AppBodyMuted>
      </div>
    </section>
  );
}
