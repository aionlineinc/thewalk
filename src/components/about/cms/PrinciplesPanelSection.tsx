import Image from "next/image";
import { InlineScriptureRefs } from "@/components/scripture/ScriptureSupportLine";
import { cmsAssetPresets } from "@/lib/cms/assets";
import { renderProseParagraphs } from "@/lib/cms/prose";
import type { Section } from "@/lib/cms/schemas";

type PrinciplesPanel = Extract<Section, { __collection: "section_principles_panel" }>;

interface Props {
  section: PrinciplesPanel;
  /** ID applied to the section element + headline (defaults to "ministry-structure"). */
  anchorId?: string;
}

/**
 * Two-column layout that matches the original Ministry Structure hero:
 * image-and-headline column on the left, panel of named principles
 * (each with optional scripture refs) on the right.
 *
 * The image is rendered with the `diagram` preset to preserve crisp
 * org-chart edges. Layout breakpoints, aspect ratio and max-widths are
 * fixed in the JSX (not driven by CMS) so the design cannot drift.
 */
export function PrinciplesPanelSection({ section, anchorId = "ministry-structure" }: Props) {
  const headingId = `${anchorId}-heading`;
  const imageUrl = section.image ? cmsAssetPresets.diagram(section.image) : null;

  return (
    <section
      id={anchorId}
      className="mb-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-14"
      aria-labelledby={headingId}
    >
      <div className="order-1 space-y-8 lg:order-none">
        <div className="max-w-3xl space-y-4">
          <h1
            id={headingId}
            className="text-3xl font-normal tracking-tight text-earth-900 md:text-4xl"
          >
            {section.headline}
          </h1>
          {section.subheadline && (
            <p className="text-[15px] font-light leading-relaxed text-muted-foreground">
              {section.subheadline}
            </p>
          )}
        </div>
        {imageUrl && (
          <figure className="w-full">
            <div className="relative aspect-[800/568] w-full">
              <Image
                src={imageUrl}
                alt={section.image_alt}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 28rem"
                priority
              />
            </div>
          </figure>
        )}
      </div>

      <div className="order-2 space-y-6 rounded-2xl p-6 shadow-sm md:p-8 lg:order-none lg:self-start">
        {section.items.map((item) => (
          <div key={item.id}>
            <h3 className="text-lg font-medium uppercase tracking-wide text-earth-900">
              {renderTitle(item.title)}
            </h3>
            {item.body && (
              <div className="mt-1 space-y-4 text-[15px] font-light leading-relaxed text-muted-foreground">
                {renderProseParagraphs(item.body)}
              </div>
            )}
            {item.scripture_refs && (
              <InlineScriptureRefs className="mt-3 text-sm font-medium tracking-wide text-earth-500">
                {item.scripture_refs}
              </InlineScriptureRefs>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * The original "Discipleship | Fellowship" header rendered the divider as a
 * lighter-weight earth-500 character. We replicate that styling without
 * forcing editors to write HTML by detecting a literal pipe and softening
 * its visual weight.
 */
function renderTitle(title: string) {
  const parts = title.split(/\s*\|\s*/);
  if (parts.length === 1) return title;
  return parts.map((p, i) => (
    <span key={i}>
      {i > 0 && <span className="font-normal text-earth-500"> | </span>}
      {p}
    </span>
  ));
}
