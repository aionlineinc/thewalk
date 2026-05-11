"use server";

import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireStaffSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

const updateRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.nativeEnum(UserRole),
});

export async function updateUserRole(formData: FormData) {
  await requireStaffSession();

  const parsed = updateRoleSchema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });

  if (!parsed.success) return;

  await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
  });

  revalidatePath("/dashboard/admin/users");
  revalidatePath("/dashboard/admin");
}
