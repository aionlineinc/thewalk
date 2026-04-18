import type { Metadata } from "next";
import Link from "next/link";

import { BeliefsArticle } from "./BeliefsArticle";
import { DoctrineBlockSection } from "@/components/about/cms/DoctrineBlockSection";
import { ScriptureEnhance } from "@/components/scripture/ScriptureEnhance";
import { getPage, type Section } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Beliefs (by Structure) | theWalk Ministries",
  description:
    "What we believe about the Father, the Son, the Holy Spirit, and the people of God—structure, unity, and servant leadership.",
};

type DoctrineBlock = Extract<Section, { __collection: "section_doctrine_block" }>;

/**
 * Compute an in-page anchor from a doctrine block headline.
 *
 * The original page used hand-tuned slugs ("father", "the-son", "holy-spirit",
 * "members"). We replicate the same shape with a small set of rules that
 * editors can predict:
 *   • leading "The " is stripped
 *   • parenthesized clarifiers are stripped (e.g. "(Jesus Christ)")
 *   • everything else is lowercased + dashified
 */
function anchorForHeadline(headline: string | null | undefined): string {
  if (!headline) return "";
  return headline
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function BeliefsPage() {
  const page = await getPage("beliefs");
  const blocks = (page?.sections ?? []).filter(
    (s): s is DoctrineBlock => s.__collection === "section_doctrine_block",
  );

  if (blocks.length === 0) {
    return <BeliefsArticle />;
  }

  const navItems = blocks.map((b) => ({
    id: anchorForHeadline(b.headline),
    label: b.headline ?? "",
    block: b,
  }));

  return (
    <article className="bg-background pb-24 pt-28 md:pb-32 md:pt-36">
      <div className="container mx-auto max-w-3xl px-4">
        <nav aria-label="Breadcrumb" className="mb-10">
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-earth-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth-900"
          >
            ← Back to About
          </Link>
        </nav>

        <header className="mb-12">
          <h1 className="text-3xl font-normal tracking-tight text-earth-900 md:text-4xl">
            {page?.title ?? "Our Beliefs"}
          </h1>
        </header>

        <nav
          className="sticky top-24 z-10 -mx-4 mb-12 bg-background/95 px-4 py-3 backdrop-blur-sm md:top-28"
          aria-label="On this page"
        >
          <ul className="flex flex-wrap gap-2 md:gap-3">
            {navItems.map((item) => {
              const shortLabel = item.label.replace(/\s*\(.*?\)\s*/g, "").trim();
              return (
                <li key={item.id || item.label}>
                  <a
                    href={`#${item.id}`}
                    className="inline-flex rounded-full border border-earth-200 bg-white px-3 py-1.5 text-xs font-medium tracking-wide text-earth-900 transition-colors hover:border-earth-500 hover:bg-earth-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth-900 md:px-4 md:py-2 md:text-sm"
                  >
                    {shortLabel}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <ScriptureEnhance>
          <div className="space-y-20">
            {navItems.map(({ id, block }) => (
              <DoctrineBlockSection key={block.id} section={block} anchorId={id} />
            ))}
          </div>
        </ScriptureEnhance>
      </div>
    </article>
  );
}
