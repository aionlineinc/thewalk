import { directusFetch } from "@/lib/directus";

/**
 * Fetch items from a Directus collection. Works both with an admin
 * `DIRECTUS_TOKEN` (sees drafts + archived) and unauthenticated (sees whatever
 * the public policy allows — currently `status == "published"`).
 *
 * Returns `null` only when the request fails (network, 4xx/5xx), so the caller
 * can fall back to the in-app scaffold content.
 */
export async function fetchDirectusItems<T>(
  collection: string,
  query: Record<string, string | number | boolean | undefined> = {}
): Promise<T[] | null> {
  try {
    const res = await directusFetch<{ data: T[] }>(`/items/${collection}`, {
      limit: 200,
      sort: "-date_updated",
      ...query,
    });
    return res.data ?? [];
  } catch {
    return null;
  }
}

export function directusAdminUiUrl(): string {
  // Prefer an explicitly public URL; fall back to the canonical CMS host so the
  // link always points at the browser-reachable Directus UI, not the internal
  // server URL (which may be a container/DNS name).
  const u = process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://cms.thewalk.org";
  return `${u.replace(/\/$/, "")}/admin`;
}
