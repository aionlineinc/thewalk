"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireStaffSession } from "../_lib/require-staff";
import { groupRegistrationService } from "@/server/services";

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

  const registrations = groupRegistrationService();
  const result = await registrations.approve({ registrationId: parsed.data.registrationId });
  if (!result.ok) {
    return { ok: false as const, error: result.error.message ?? "Could not create organization." };
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

  const registrations = groupRegistrationService();
  const result = await registrations.reject({ registrationId: parsed.data.registrationId });
  if (!result.ok) {
    return { ok: false as const, error: result.error.message ?? "Registration not found or already processed." };
  }

  revalidatePath("/admin/groups");
  revalidatePath("/admin");
  return { ok: true as const };
}
