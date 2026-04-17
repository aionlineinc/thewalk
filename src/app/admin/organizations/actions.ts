"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "../_lib/require-staff";

const createOrgSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and dashes only."),
  kind: z.string().min(2).max(60).default("organization"),
});

export async function createOrganization(formData: FormData) {
  const session = await requireStaffSession();
  if (!session) return { ok: false as const, error: "Unauthorized" };

  const parsed = createOrgSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    kind: String(formData.get("kind") ?? "organization"),
  });

  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await prisma.organization.create({ data: parsed.data });
    revalidatePath("/admin/organizations");
    revalidatePath("/admin");
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "Failed to create organization (slug must be unique)." };
  }
}

