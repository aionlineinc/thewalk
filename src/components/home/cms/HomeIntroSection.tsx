/**
 * "What is theWalk" rich-text intro — CMS adapter for `section_rich_text`.
 *
 * Mirrors the original markup in `src/app/page.tsx` exactly. Body is plain
 * paragraph text (no markdown rendering needed at this slot), so we render
 * it as a single <AppLead>. If editors need richer formatting later we can
 * swap to a Markdown renderer.
 */
import { AppHeadingSection, AppLead } from "@/components/ui/Typography";
import { type Section } from "@/lib/cms";

type RichTextSection = Extract<Section, { __collection: "section_rich_text" }>;

export function HomeIntroSection({ section }: { section: RichTextSection; index: number }) {
  return (
    <section
      id="home-about-teaser"
      className="w-full bg-white pb-20 pt-24 text-center md:pt-[100px]"
      aria-labelledby="home-about-teaser-heading"
    >
      <div className="container mx-auto max-w-4xl px-4">
        {section.headline ? (
          <AppHeadingSection id="home-about-teaser-heading" className="mb-6">
            {section.headline}
          </AppHeadingSection>
        ) : null}
        <AppLead id="home-about-teaser-body" className="mx-auto max-w-[650px]">
          {section.body}
        </AppLead>
      </div>
    </section>
  );
}
