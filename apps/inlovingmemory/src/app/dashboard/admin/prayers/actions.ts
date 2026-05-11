"use server";

import { IlmSubmissionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireStaffSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

const statusSchema = z.object({
  prayerId: z.string().uuid(),
  status: z.nativeEnum(IlmSubmissionStatus),
});

export async function setPrayerStatus(formData: FormData) {
  await requireStaffSession();

  const parsed = statusSchema.safeParse({
    prayerId: formData.get("prayerId"),
    status: formData.get("status"),
  });

  if (!parsed.success) return;

  await prisma.ilmPrayer.update({
    where: { id: parsed.data.prayerId },
    data: { status: parsed.data.status },
  });

  revalidatePath("/dashboard/admin/prayers");
  revalidatePath("/dashboard/admin");
}
