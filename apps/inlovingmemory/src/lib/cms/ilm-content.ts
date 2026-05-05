import { ilmMarketingDefault, type IlmMarketingContent } from "@/content/ilm-marketing.default";
import { directusGetJson, getDirectusConfig } from "@/lib/cms/directus-client";

/**
 * Returns marketing content for ILM. Always returns something (local fallback)
 * so deploys are not blocked on CMS configuration.
 *
 * Directus integration is intentionally thin: if configured, it attempts to fetch
 * a single-item JSON payload. If it fails, we fall back to defaults.
 */
export async function getIlmMarketingContent(): Promise<IlmMarketingContent> {
  const cfg = getDirectusConfig();
  if (!cfg) return ilmMarketingDefault;

  // Convention-based endpoint:
  // - Create a collection like `ilm_marketing` with a singleton item `default`,
  //   or adjust `ILM_MARKETING_DIRECTUS_PATH` without code changes.
  const path = process.env.ILM_MARKETING_DIRECTUS_PATH?.trim() || "/items/ilm_marketing/default";

  try {
    const res = await directusGetJson<{ data?: unknown }>(path);
    const data = res && typeof res === "object" && "data" in res ? (res as { data?: unknown }).data : undefined;
    if (!data || typeof data !== "object") return ilmMarketingDefault;

    // We deliberately keep this permissive: Directus fields can evolve.
    // Only override when the value is structurally compatible.
    return { ...ilmMarketingDefault, ...(data as Partial<IlmMarketingContent>) };
  } catch {
    return ilmMarketingDefault;
  }
}

