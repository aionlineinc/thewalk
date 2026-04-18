import type { Metadata } from "next";
import Link from "next/link";

import { MinistryStructureArticle } from "./MinistryStructureArticle";
import { DoctrineBlockSection } from "@/components/about/cms/DoctrineBlockSection";
import { PrinciplesPanelSection } from "@/components/about/cms/PrinciplesPanelSection";
import { ScriptureEnhance } from "@/components/scripture/ScriptureEnhance";
import { findSection, getPage } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Ministry Structure | theWalk Ministries",
  description:
    "How theWalk organizes servant leadership, discipleship, and governance—from Christ as foundation through mission, vision, and core teams.",
};

export default async function MinistryStructurePage() {
  const page = await getPage("ministry-structure");
  const principles = findSection(page?.sections, "section_principles_panel");
  const system = findSection(page?.sections, "section_doctrine_block");

  // If neither slot is present, fall back to the original hardcoded article
  // so the route is never empty even if Directus is unreachable.
  if (!principles && !system) {
    return <MinistryStructureArticle />;
  }

  return (
    <article className="bg-background pb-24 pt-28 md:pb-32 md:pt-36">
      <div className="container mx-auto max-w-6xl px-4">
        <nav aria-label="Breadcrumb" className="mb-10">
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-earth-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth-900"
          >
            ← Back to About
          </Link>
        </nav>

        <ScriptureEnhance>
          {principles && (
            <PrinciplesPanelSection section={principles} anchorId="ministry-structure-heading" />
          )}
          {system && <DoctrineBlockSection section={system} anchorId="ministry-structure-system" />}
        </ScriptureEnhance>
      </div>
    </article>
  );
}
