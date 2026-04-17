import { directusFetch } from "@/lib/directus";

export async function fetchDirectusItems<T>(
  collection: string,
  query: Record<string, string | number | boolean | undefined> = {}
): Promise<T[] | null> {
  if (!process.env.DIRECTUS_TOKEN) return null;
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

export function directusAdminUiUrl(): string | null {
  const u = process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL;
  if (!u) return null;
  return `${u.replace(/\/$/, "")}/admin`;
}
