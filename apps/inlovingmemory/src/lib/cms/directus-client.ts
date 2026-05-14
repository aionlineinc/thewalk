type DirectusClientConfig = {
  baseUrl: string;
  token?: string;
};

function withSlashTrimmed(s: string) {
  return s.replace(/\/+$/, "");
}

/** Directus image transform presets — mirrors thewalk.org's cmsAssetPresets pattern. */
export const ilmAssetPresets = {
  /** Full-bleed hero background: 2000px wide, WebP, cover fit. */
  hero: { width: 2000, quality: 85, format: "webp" as const, fit: "cover" as const },
  /** Half-width / card image: 800px wide. */
  card: { width: 800, quality: 85, format: "webp" as const, fit: "cover" as const },
} as const;

/**
 * Build a Directus asset URL with transform params from a file reference.
 * Accepts either a plain UUID string or an expanded `{ id }` object.
 * Returns null when the input is neither.
 */
export function cmsAssetUrl(
  baseUrl: string,
  fileRef: unknown,
  preset: { width: number; quality: number; format: string; fit: string },
): string | null {
  let id: string | null = null;
  if (typeof fileRef === "string" && fileRef.trim()) {
    // If it's already a full URL, return as-is (e.g. Unsplash fallback).
    if (fileRef.startsWith("http")) return fileRef;
    id = fileRef.trim();
  } else if (fileRef && typeof fileRef === "object" && typeof (fileRef as Record<string, unknown>).id === "string") {
    id = (fileRef as Record<string, unknown>).id as string;
  }
  if (!id) return null;
  const params = new URLSearchParams({
    width: String(preset.width),
    quality: String(preset.quality),
    format: preset.format,
    fit: preset.fit,
  });
  return `${baseUrl}/assets/${id}?${params.toString()}`;
}

export function getDirectusConfig(): DirectusClientConfig | null {
  const baseUrl = (
    process.env.DIRECTUS_URL ||
    process.env.NEXT_PUBLIC_DIRECTUS_URL ||
    process.env.NEXT_PUBLIC_CMS_URL
  )?.trim();
  if (!baseUrl) return null;
  const token = (process.env.DIRECTUS_TOKEN || process.env.DIRECTUS_ACCESS_TOKEN)?.trim() || undefined;
  return { baseUrl: withSlashTrimmed(baseUrl), token };
}

export async function directusGetJson<T>(path: string): Promise<T> {
  const cfg = getDirectusConfig();
  if (!cfg) {
    throw new Error("Directus is not configured (missing DIRECTUS_URL).");
  }

  const url = `${cfg.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      ...(cfg.token ? { Authorization: `Bearer ${cfg.token}` } : {}),
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Directus GET ${path} failed (${res.status}): ${body.slice(0, 400)}`);
  }

  return (await res.json()) as T;
}

