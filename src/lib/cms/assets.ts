/**
 * Directus asset URL builder.
 *
 * Files live at `${NEXT_PUBLIC_CMS_URL}/assets/{file-id}`. Transform params
 * (width/height/fit/quality/format) are appended to request a resized/cropped
 * variant on the fly. We always request a transform so hero slots stay
 * consistent regardless of the source file's native dimensions.
 */

export type AssetFit = "cover" | "contain" | "inside" | "outside";
export type AssetFormat = "auto" | "jpg" | "png" | "webp" | "avif";

export interface AssetTransform {
  width?: number;
  height?: number;
  fit?: AssetFit;
  quality?: number;
  format?: AssetFormat;
  withoutEnlargement?: boolean;
}

/** Minimal file reference accepted by {@link cmsAsset}. The richer schema type
 * lives in `./schemas.ts` as `FileRef`; this one is intentionally permissive
 * so callers outside the CMS layer can pass any shape they have. */
export type AssetFileRef =
  | string
  | null
  | undefined
  | {
      id?: string | null;
      [key: string]: unknown;
    };

function fileId(ref: AssetFileRef): string | null {
  if (!ref) return null;
  if (typeof ref === "string") return ref || null;
  if (typeof ref === "object" && ref.id) return String(ref.id);
  return null;
}

export function cmsBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_CMS_URL ||
    process.env.NEXT_PUBLIC_DIRECTUS_URL ||
    "https://cms.thewalk.org"
  ).replace(/\/$/, "");
}

/** Build a public URL for a Directus file with optional on-the-fly transforms. */
export function cmsAsset(ref: AssetFileRef, opts: AssetTransform = {}): string | null {
  const id = fileId(ref);
  if (!id) return null;
  const qs = new URLSearchParams();
  if (opts.width) qs.set("width", String(opts.width));
  if (opts.height) qs.set("height", String(opts.height));
  if (opts.fit) qs.set("fit", opts.fit);
  if (opts.quality !== undefined) qs.set("quality", String(opts.quality));
  if (opts.format) qs.set("format", opts.format);
  if (opts.withoutEnlargement) qs.set("withoutEnlargement", "true");
  const q = qs.toString();
  return `${cmsBaseUrl()}/assets/${id}${q ? `?${q}` : ""}`;
}

/** Convenience preset URL for common slots so components stay consistent. */
export const cmsAssetPresets = {
  heroFull: (ref: AssetFileRef) =>
    cmsAsset(ref, { width: 2000, quality: 85, format: "webp", fit: "cover" }),
  heroHalf: (ref: AssetFileRef) =>
    cmsAsset(ref, { width: 1200, quality: 85, format: "webp", fit: "cover" }),
  card: (ref: AssetFileRef) =>
    cmsAsset(ref, { width: 800, quality: 80, format: "webp", fit: "cover" }),
  thumb: (ref: AssetFileRef) =>
    cmsAsset(ref, { width: 400, quality: 80, format: "webp", fit: "cover" }),
  logo: (ref: AssetFileRef) =>
    cmsAsset(ref, { width: 320, quality: 90, format: "webp", fit: "contain" }),
  ogImage: (ref: AssetFileRef) =>
    cmsAsset(ref, { width: 1200, height: 630, quality: 85, format: "jpg", fit: "cover" }),
} as const;
