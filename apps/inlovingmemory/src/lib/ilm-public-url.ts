/** Canonical absolute URL for a memorial when `NEXT_PUBLIC_ILM_URL` is set (for sharing). */
export function getMemorialAbsoluteUrl(slug: string) {
  const base = process.env.NEXT_PUBLIC_ILM_URL?.trim().replace(/\/$/, "");
  if (!base) return null;
  return `${base}/memorial/${slug}`;
}
