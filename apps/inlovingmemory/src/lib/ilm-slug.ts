import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

export function slugBaseFromDisplayName(displayName: string) {
  const base = displayName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return base || "memorial";
}

export async function allocateUniqueSlug(displayName: string) {
  const base = slugBaseFromDisplayName(displayName);
  let candidate = base;
  for (let i = 0; i < 20; i += 1) {
    const taken = await prisma.ilmMemorial.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!taken) return candidate;
    const suffix = randomBytes(3).toString("hex");
    candidate = `${base}-${suffix}`.slice(0, 80);
  }
  throw new Error("Could not allocate a unique URL slug. Try a different name.");
}
