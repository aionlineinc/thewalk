/**
 * Public entry point for the CMS module.
 *
 * Usage:
 *   import { getPage, cmsAsset, PageRenderer } from "@/lib/cms";
 *   const page = await getPage("home");
 *   // ... in component ...
 *   <PageRenderer sections={page?.sections ?? fallbackSections} />
 */
export * from "./assets";
export * from "./schemas";
export { getPage, getSiteSettings, listPublishedPageSlugs } from "./fetch";
