"use server";

import { IlmEventKind } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaffSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

export async function createEvent(formData: FormData) {
  await requireStaffSession();
  const memorialId = (formData.get("memorialId") as string)?.trim();
  const kind = (formData.get("kind") as string) || "FUNERAL";
  const title = (formData.get("title") as string)?.trim() || null;
  const startsAt = (formData.get("startsAt") as string) ? new Date(formData.get("startsAt") as string) : null;
  const venue = (formData.get("venue") as string)?.trim() || null;
  const address = (formData.get("address") as string)?.trim() || null;
  const mapUrl = (formData.get("mapUrl") as string)?.trim() || null;
  const officiant = (formData.get("officiant") as string)?.trim() || null;
  const programDetails = (formData.get("programDetails") as string)?.trim() || null;
  const streamUrl = (formData.get("streamUrl") as string)?.trim() || null;

  if (!memorialId) return;
  await prisma.ilmEvent.create({
    data: { memorialId, kind: kind as IlmEventKind, title, startsAt, venue, address, mapUrl, officiant, programDetails, streamUrl },
  });
  revalidatePath("/dashboard/admin/funeral");
  redirect("/dashboard/admin/funeral");
}

export async function deleteEvent(formData: FormData) {
  await requireStaffSession();
  const id = (formData.get("id") as string)?.trim();
  if (id) await prisma.ilmEvent.delete({ where: { id } });
  revalidatePath("/dashboard/admin/funeral");
  redirect("/dashboard/admin/funeral");
}

export async function addFlower(formData: FormData) {
  await requireStaffSession();
  const memorialId = (formData.get("memorialId") as string)?.trim();
  const label = (formData.get("label") as string)?.trim();
  const url = (formData.get("url") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const kind = (formData.get("kind") as string) || "FLOWERS";
  if (!memorialId || !label) return;
  await prisma.ilmFlowerDonation.create({ data: { memorialId, label, url, description, kind } });
  revalidatePath("/dashboard/admin/funeral");
  redirect("/dashboard/admin/funeral");
}

export async function removeFlower(formData: FormData) {
  await requireStaffSession();
  const id = (formData.get("id") as string)?.trim();
  if (id) await prisma.ilmFlowerDonation.delete({ where: { id } });
  revalidatePath("/dashboard/admin/funeral");
  redirect("/dashboard/admin/funeral");
}
