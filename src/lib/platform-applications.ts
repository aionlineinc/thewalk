import { prisma } from "@/lib/prisma";

export type ExternalProductLink = {
  slug: string;
  label: string;
  href: string;
};

/**
 * External products (ILM, Connect8, …) from PlatformApplication.
 * myWalk is not registered here — it lives under Cross Roads / ministry nav.
 *
 * Entitlements: if the user has no rows in UserApplicationEntitlement, all enabled
 * apps are shown to staff. If at least one row exists, only listed applications are shown.
 */
export async function getExternalProductLinksForUser(userId: string): Promise<ExternalProductLink[]> {
  const [apps, entitlements] = await Promise.all([
    prisma.platformApplication.findMany({
      where: { enabled: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.userApplicationEntitlement.findMany({
      where: { userId },
      select: { applicationId: true },
    }),
  ]);

  /** Before seed runs, allow local/dev sidebar link via env. */
  if (apps.length === 0) {
    const ilm = process.env.ILM_APP_URL?.trim();
    if (ilm) {
      return [{ slug: "ilm", label: "inLovingMemory", href: ilm.replace(/\/$/, "") }];
    }
  }

  const allowedIds =
    entitlements.length > 0 ? new Set(entitlements.map((e) => e.applicationId)) : null;

  const filtered =
    allowedIds === null ? apps : apps.filter((a) => allowedIds.has(a.id));

  return filtered.map((a) => ({
    slug: a.slug,
    label: a.label,
    href: a.baseUrl.replace(/\/$/, ""),
  }));
}
