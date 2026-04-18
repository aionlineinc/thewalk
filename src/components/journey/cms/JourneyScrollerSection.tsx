import { JourneyImmersiveScroller, type Slide } from "@/components/journey/JourneyImmersiveScroller";
import { cmsAssetPresets } from "@/lib/cms/assets";
import type { Section } from "@/lib/cms/schemas";

type JourneyScroller = Extract<
  Section,
  { __collection: "section_journey_scroller" }
>;

interface Props {
  section: JourneyScroller;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitCsv(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * CMS adapter for /journey's sticky scroll-driven hero.
 *
 * Maps validated CMS slides into the `Slide[]` shape expected by the
 * existing `JourneyImmersiveScroller` client component, so the scroll
 * mechanics, sticky stack, and right-hand nav are reused verbatim.
 *
 * Slides are capped at 4 — the scroller's `TOTAL` constant assumes a
 * fixed 4-up layout. Extra slides are ignored; missing slides cause the
 * component to render fewer cards but keep the same scroll distance.
 *
 * Slides without a usable image are dropped: the scroller is image-led
 * and a black card with no photo would be visually broken.
 */
export function JourneyScrollerSection({ section }: Props) {
  const slides: Slide[] = [];
  for (const raw of section.slides) {
    const bg = cmsAssetPresets.heroFull(raw.image);
    if (!bg) continue;
    const label = raw.label;
    const key = (raw.key && raw.key.trim()) || slugify(label) || raw.id;
    const ministries = splitCsv(raw.ministries_csv);
    slides.push({
      key,
      label,
      eyebrow: raw.eyebrow ?? undefined,
      title: raw.title,
      body: raw.body ?? "",
      href: raw.href ?? undefined,
      cta: raw.cta_label ?? undefined,
      bg,
      ministries: ministries.length > 0 ? ministries : undefined,
    });
  }

  if (slides.length === 0) return null;
  return <JourneyImmersiveScroller slides={slides} />;
}
