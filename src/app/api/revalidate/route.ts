/**
 * Revalidation endpoint for Directus webhooks.
 *
 * Directus Flow config:
 *   Trigger:   Event Hook → action.items.{create,update,delete}
 *   Scope:     pages, site_settings, pages_sections, section_*
 *   Operation: Webhook (POST) to
 *              `${NEXT_PUBLIC_APP_URL}/api/revalidate`
 *   Headers:   `x-revalidate-secret: ${REVALIDATION_SECRET}`
 *   Body:      JSON. The route accepts either:
 *                { "tag": "page:home" }            → revalidates the page
 *                { "path": "/about" }              → revalidates a path
 *                { "collection": "pages", "keys": ["home"] }
 *                   → revalidates each slug as `page:<slug>`
 *              If no body, revalidates the global `cms` tag.
 *
 * Security: requires the shared secret in header OR `?secret=` query param.
 */
import type { NextRequest } from "next/server";
import { handleCmsRevalidateGET, handleCmsRevalidatePOST } from "@/modules/cms/revalidate";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return handleCmsRevalidatePOST(req);
}

export async function GET(req: NextRequest) {
  return handleCmsRevalidateGET(req);
}
