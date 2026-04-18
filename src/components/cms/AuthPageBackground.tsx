/**
 * Background image used by the sign-in and register-group routes.
 *
 * Reads the first `section_hero` from the page and renders the same fixed
 * background JSX the routes have always rendered, with the image sourced
 * from the CMS. If `section` is null we fall back to the original Unsplash
 * URL so the page still looks correct even when Directus is unreachable.
 */
import { cmsAssetPresets, type Section } from "@/lib/cms";

const FALLBACK_URL =
  "https://images.unsplash.com/photo-1523437237164-d442d57cc3c9?q=80&w=2400&auto=format&fit=crop";

type HeroSection = Extract<Section, { __collection: "section_hero" }>;

export function AuthPageBackground({ section }: { section: HeroSection | null }) {
  const src = section ? cmsAssetPresets.heroFull(section.image) : null;
  const url = src ?? FALLBACK_URL;
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url('${url}')` }}
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/15 backdrop-blur-[2px]" />
    </>
  );
}
