/**
 * About editorial split block — CMS adapter for `section_rich_text`.
 *
 * Renders via the existing `EditorialSplitBlock`, honouring the new
 * `reversed` flag from the schema. The `sectionId`/`headingId`/`bodyId`
 * are passed through as a stable id derived from the section so the
 * anchor IDs match the hardcoded About page.
 */
import { EditorialSplitBlock } from "@/components/ui/EditorialSplitBlock";
import { type Section } from "@/lib/cms";

type RichTextSection = Extract<Section, { __collection: "section_rich_text" }>;

export function AboutEditorialBlock({
  section,
  idPrefix,
}: {
  section: RichTextSection;
  index: number;
  /** Used to derive deterministic DOM ids — e.g. "about-who-we-are". */
  idPrefix: string;
}) {
  return (
    <EditorialSplitBlock
      sectionId={idPrefix}
      headingId={`${idPrefix}-heading`}
      bodyId={`${idPrefix}-body`}
      headline={section.headline ?? ""}
      body={section.body}
      reversed={Boolean(section.reversed)}
    />
  );
}
