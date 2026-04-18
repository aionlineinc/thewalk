/**
 * About Vision/Mission cards — CMS adapter for `section_feature_cards`.
 *
 * Renders the EXACT same 2-column card grid the hardcoded About page renders.
 * The schema's `columns` and `icon` fields are intentionally ignored here
 * because this slot has a fixed visual treatment (2 cards, no icons).
 */
import { AppBody, AppHeadingCard } from "@/components/ui/Typography";
import { type Section } from "@/lib/cms";

type FeatureCardsSection = Extract<Section, { __collection: "section_feature_cards" }>;

export function AboutVisionMissionCards({
  section,
}: {
  section: FeatureCardsSection;
  index: number;
}) {
  const items = section.items.slice(0, 2);
  return (
    <section id="about-vision-mission" className="bg-muted py-24">
      <div className="container mx-auto grid max-w-content-wide grid-cols-1 gap-12 px-4 md:grid-cols-2">
        {items.map((item, i) => {
          const id = i === 0 ? "about-vision" : "about-mission";
          return (
            <div
              key={item.id}
              id={id}
              className="rounded-2xl border border-earth-100 bg-white p-12 shadow-sm"
            >
              <AppHeadingCard id={`${id}-heading`} className="mb-4">
                {item.title}
              </AppHeadingCard>
              {item.body ? <AppBody id={`${id}-body`}>{item.body}</AppBody> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
