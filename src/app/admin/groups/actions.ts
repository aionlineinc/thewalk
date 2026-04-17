"use server";

import { z } from "zod";
import { GroupRegistrationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "../_lib/require-staff";

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "group";
}

async function uniqueOrgSlug(base: string): Promise<string> {
  let slug = base;
  for (let n = 0; ; n += 1) {
    const clash = await prisma.organization.findUnique({ where: { slug } });
    if (!clash) return slug;
    slug = `${base}-${n + 1}`;
  }
}

const idSchema = z.object({
  registrationId: z.string().uuid(),
});

export async function approveGroupRegistration(formData: FormData) {
  const session = await requireStaffSession();
  if (!session) return { ok: false as const, error: "Unauthorized" };

  const parsed = idSchema.safeParse({
    registrationId: String(formData.get("registrationId") ?? ""),
  });
  if (!parsed.success) return { ok: false as const, error: "Invalid request" };

  const reg = await prisma.groupRegistration.findUnique({ where: { id: parsed.data.registrationId } });
  if (!reg || reg.status !== GroupRegistrationStatus.PENDING) {
    return { ok: false as const, error: "Registration not found or already processed." };
  }

  const baseSlug = slugify(reg.desiredSlug?.trim() || reg.organizationName);
  const slug = await uniqueOrgSlug(baseSlug);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.organization.create({
        data: {
          name: reg.organizationName,
          slug,
          kind: "organization",
        },
      });
      await tx.groupRegistration.update({
        where: { id: reg.id },
        data: {
          status: GroupRegistrationStatus.APPROVED,
          reviewedAt: new Date(),
        },
      });
    });
  } catch {
    return { ok: false as const, error: "Could not create organization." };
  }

  revalidatePath("/admin/groups");
  revalidatePath("/admin");
  revalidatePath("/admin/organizations");
  return { ok: true as const };
}

export async function rejectGroupRegistration(formData: FormData) {
  const session = await requireStaffSession();
  if (!session) return { ok: false as const, error: "Unauthorized" };

  const parsed = idSchema.safeParse({
    registrationId: String(formData.get("registrationId") ?? ""),
  });
  if (!parsed.success) return { ok: false as const, error: "Invalid request" };

  const reg = await prisma.groupRegistration.findUnique({ where: { id: parsed.data.registrationId } });
  if (!reg || reg.status !== GroupRegistrationStatus.PENDING) {
    return { ok: false as const, error: "Registration not found or already processed." };
  }

  await prisma.groupRegistration.update({
    where: { id: reg.id },
    data: {
      status: GroupRegistrationStatus.REJECTED,
      reviewedAt: new Date(),
    },
  });

  revalidatePath("/admin/groups");
  revalidatePath("/admin");
  return { ok: true as const };
}
