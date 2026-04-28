"use server";

import { z } from "zod";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireStaffSession } from "../_lib/require-staff";
import { identityService, organizationsService } from "@/server/services";

const updateUserRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.nativeEnum(UserRole),
});

export async function updateUserRole(formData: FormData) {
  const session = await requireStaffSession();
  if (!session) return { ok: false as const, error: "Unauthorized" };

  const parsed = updateUserRoleSchema.safeParse({
    userId: String(formData.get("userId") ?? ""),
    role: String(formData.get("role") ?? ""),
  });
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const identity = identityService();
  const result = await identity.updateUserRole({ userId: parsed.data.userId, role: parsed.data.role });
  if (!result.ok) return { ok: false as const, error: result.error.message ?? "Could not update role" };

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return { ok: true as const };
}

const addMembershipSchema = z.object({
  userId: z.string().uuid(),
  organizationId: z.string().uuid(),
  role: z.nativeEnum(UserRole).default(UserRole.MEMBER),
});

export async function addMembership(formData: FormData) {
  const session = await requireStaffSession();
  if (!session) return { ok: false as const, error: "Unauthorized" };

  const parsed = addMembershipSchema.safeParse({
    userId: String(formData.get("userId") ?? ""),
    organizationId: String(formData.get("organizationId") ?? ""),
    role: String(formData.get("role") ?? UserRole.MEMBER),
  });
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const organizations = organizationsService();
  const result = await organizations.addMembership({
    userId: parsed.data.userId,
    organizationId: parsed.data.organizationId,
    role: parsed.data.role,
  });
  if (!result.ok) return { ok: false as const, error: result.error.message ?? "Could not add membership" };

  revalidatePath("/admin/users");
  revalidatePath("/admin/organizations");
  revalidatePath("/admin");
  return { ok: true as const };
}

const removeMembershipSchema = z.object({
  membershipId: z.string().uuid(),
});

export async function removeMembership(formData: FormData) {
  const session = await requireStaffSession();
  if (!session) return { ok: false as const, error: "Unauthorized" };

  const parsed = removeMembershipSchema.safeParse({
    membershipId: String(formData.get("membershipId") ?? ""),
  });
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const organizations = organizationsService();
  const result = await organizations.removeMembership({ membershipId: parsed.data.membershipId });
  if (!result.ok) return { ok: false as const, error: result.error.message ?? "Could not remove membership" };

  revalidatePath("/admin/users");
  revalidatePath("/admin/organizations");
  revalidatePath("/admin");
  return { ok: true as const };
}
