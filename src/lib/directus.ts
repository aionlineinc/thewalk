/**
 * Directus Fetch Wrapper
 *
 * Uses Directus REST API. Keep server-side calls pointing at internal URL when available.
 */

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://127.0.0.1:8055";

type FetchOptions = RequestInit & {
  next?: { revalidate?: number };
};

export async function directusFetch<T>(
  path: string,
  urlParams: Record<string, string | number | boolean | undefined> = {},
  options: FetchOptions = {}
): Promise<T> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(urlParams)) {
    if (v === undefined) continue;
    qs.set(k, String(v));
  }
  const requestUrl = `${DIRECTUS_URL}${path}${qs.toString() ? `?${qs.toString()}` : ""}`;

  const res = await fetch(requestUrl, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Directus error ${res.status} ${res.statusText}: ${body}`);
  }

  return (await res.json()) as T;
}

