import type { ReactNode } from "react";
import {
  InlineScriptureRefs,
  SupportingScripturesLine,
} from "@/components/scripture/ScriptureSupportLine";
import { renderProseParagraphs } from "@/lib/cms/prose";
import type { Section } from "@/lib/cms/schemas";

type DoctrineBlock = Extract<Section, { __collection: "section_doctrine_block" }>;

function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4 text-[15px] font-light leading-relaxed text-muted-foreground">{children}</div>
  );
}

interface Props {
  section: DoctrineBlock;
  /** Optional in-page anchor id (for sticky nav targets). */
  anchorId?: string;
}

/**
 * Renders a doctrine block exactly as the hardcoded /about/beliefs and
 * /about/ministry-structure sections do. Two visual variants:
 *   • "default"     — top-bordered editorial section (Beliefs)
 *   • "muted-panel" — soft gray rounded panel (Ministry Structure System details)
 *
 * The `items` array, when present, renders as nested h4 (default) or h3
 * (muted-panel) sub-blocks below the optional top-level body. Each item
 * may carry its own scripture refs; the whole block ends with a single
 * SupportingScripturesLine if `scripture_refs` is set on the parent.
 */
export function DoctrineBlockSection({ section, anchorId }: Props) {
  const variant = section.variant ?? "default";
  const id = anchorId ?? undefined;
  const headingId = id ? `doctrine-${id}-heading` : undefined;

  if (variant === "muted-panel") {
    return (
      <section id={id} aria-labelledby={headingId} className="mt-20">
        <div className="space-y-10 rounded-2xl bg-muted px-6 py-12 md:px-10 md:py-16">
          {section.headline && (
            <h2 id={headingId} className="text-2xl font-normal text-earth-900">
              {section.headline}
            </h2>
          )}
          {section.body && (
            <Prose>
              {renderProseParagraphs(section.body, {
                paragraphClassName:
                  "mt-4 text-[15px] font-light leading-relaxed text-muted-foreground",
              })}
            </Prose>
          )}
          {section.items?.map((item) => (
            <div key={item.id}>
              <h3 className="text-lg font-medium text-earth-900">{item.title}</h3>
              <Prose>
                {renderProseParagraphs(item.body, { firstParagraphClassName: "mt-4" })}
              </Prose>
              {item.scripture_refs && (
                <InlineScriptureRefs className="mt-3 text-sm font-medium tracking-wide text-earth-500">
                  {item.scripture_refs}
                </InlineScriptureRefs>
              )}
            </div>
          ))}
          {section.scripture_refs && (
            <SupportingScripturesLine references={section.scripture_refs} />
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="scroll-mt-36 border-t border-earth-100 pt-14"
    >
      {section.headline && (
        <h2 id={headingId} className="text-2xl font-normal text-earth-900">
          {section.headline}
        </h2>
      )}
      {section.subheadline && (
        <h3 className="mt-2 text-sm font-medium uppercase tracking-widest text-earth-500">
          {section.subheadline}
        </h3>
      )}
      {section.body && (
        <Prose>
          {renderProseParagraphs(section.body, { firstParagraphClassName: "mt-6" })}
        </Prose>
      )}
      {section.items && section.items.length > 0 && (
        <div className="mt-10 space-y-12">
          {section.items.map((item) => (
            <div key={item.id}>
              <h4 className="text-lg font-medium text-earth-900">{item.title}</h4>
              <Prose>
                {renderProseParagraphs(item.body, { firstParagraphClassName: "mt-4" })}
              </Prose>
              {item.scripture_refs && (
                <InlineScriptureRefs className="mt-3 text-sm font-medium tracking-wide text-earth-500">
                  {item.scripture_refs}
                </InlineScriptureRefs>
              )}
            </div>
          ))}
        </div>
      )}
      {section.scripture_refs && (
        <SupportingScripturesLine references={section.scripture_refs} />
      )}
    </section>
  );
}
