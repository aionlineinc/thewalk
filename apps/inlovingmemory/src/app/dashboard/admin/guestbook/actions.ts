"use server";

import { IlmSubmissionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireStaffSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

const statusSchema = z.object({
  entryId: z.string().uuid(),
  status: z.nativeEnum(IlmSubmissionStatus),
});

export async function setGuestbookStatus(formData: FormData) {
  await requireStaffSession();

  const parsed = statusSchema.safeParse({
    entryId: formData.get("entryId"),
    status: formData.get("status"),
  });

  if (!parsed.success) return;

  await prisma.ilmGuestbookEntry.update({
    where: { id: parsed.data.entryId },
    data: { status: parsed.data.status },
  });

  revalidatePath("/dashboard/admin/guestbook");
  revalidatePath("/dashboard/admin");
}
