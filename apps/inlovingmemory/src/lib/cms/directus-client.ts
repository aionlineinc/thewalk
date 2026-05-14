type DirectusClientConfig = {
  baseUrl: string;
  token?: string;
};

function withSlashTrimmed(s: string) {
  return s.replace(/\/+$/, "");
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

