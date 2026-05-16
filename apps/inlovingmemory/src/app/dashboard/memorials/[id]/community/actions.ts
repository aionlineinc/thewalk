"use server";

import { IlmSubmissionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireKeeperForMemorial(memorialId: string) {
  const session = await getServerSession(getAuthOptions());
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;
  if (!userId) redirect("/sign-in");

  const memorial = await prisma.ilmMemorial.findUnique({
    where: { id: memorialId },
    select: { pageKeeperId: true, slug: true },
  });

  if (!memorial || memorial.pageKeeperId !== userId) {
    redirect("/dashboard?error=forbidden");
  }

  return memorial;
}

function parseSubmissionStatus(v: FormDataEntryValue | null): IlmSubmissionStatus | null {
  if (typeof v !== "string") return null;
  if (v === IlmSubmissionStatus.APPROVED || v === "APPROVED") return IlmSubmissionStatus.APPROVED;
  if (v === IlmSubmissionStatus.REJECTED || v === "REJECTED") return IlmSubmissionStatus.REJECTED;
  return null;
}

function formText(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/** Standalone-safe: pass `__memorialId`, `__guestbookEntryId`, `__status`. */
export async function setGuestbookStatusFromForm(formData: FormData) {
  const memorialId = formText(formData, "__memorialId");
  const entryId = formText(formData, "__guestbookEntryId");
  const status = parseSubmissionStatus(formData.get("__status"));
  if (!memorialId || !entryId || !status) redirect("/dashboard?error=invalid");
  return setGuestbookStatus(memorialId, entryId, status);
}

/** Standalone-safe: pass `__memorialId`, `__prayerId`, `__status`. */
export async function setPrayerStatusFromForm(formData: FormData) {
  const memorialId = formText(formData, "__memorialId");
  const prayerId = formText(formData, "__prayerId");
  const status = parseSubmissionStatus(formData.get("__status"));
  if (!memorialId || !prayerId || !status) redirect("/dashboard?error=invalid");
  return setPrayerStatus(memorialId, prayerId, status);
}

export async function setGuestbookStatus(memorialId: string, entryId: string, status: IlmSubmissionStatus) {
  const memorial = await requireKeeperForMemorial(memorialId);

  const entry = await prisma.ilmGuestbookEntry.findFirst({
    where: { id: entryId, memorialId },
  });

  if (!entry) {
    redirect(`/dashboard/memorials/${memorialId}/community`);
  }

  await prisma.ilmGuestbookEntry.update({
    where: { id: entryId },
    data: { status },
  });

  revalidatePath(`/memorial/${memorial.slug}`);
  revalidatePath(`/dashboard/memorials/${memorialId}/community`);
  redirect(`/dashboard/memorials/${memorialId}/community`);
}

export async function setPrayerStatus(memorialId: string, prayerId: string, status: IlmSubmissionStatus) {
  const memorial = await requireKeeperForMemorial(memorialId);

  const prayer = await prisma.ilmPrayer.findFirst({
    where: { id: prayerId, memorialId },
  });

  if (!prayer) {
    redirect(`/dashboard/memorials/${memorialId}/community`);
  }

  await prisma.ilmPrayer.update({
    where: { id: prayerId },
    data: { status },
  });

  revalidatePath(`/memorial/${memorial.slug}`);
  revalidatePath(`/dashboard/memorials/${memorialId}/community`);
  redirect(`/dashboard/memorials/${memorialId}/community`);
}

export async function setMediaStatusFromForm(formData: FormData) {
  const memorialId = formText(formData, "__memorialId");
  const mediaId = formText(formData, "__mediaId");
  const status = parseSubmissionStatus(formData.get("__status"));
  if (!memorialId || !mediaId || !status) redirect("/dashboard?error=invalid");
  return setMediaStatus(memorialId, mediaId, status);
}

export async function submitGriefRequestFromForm(formData: FormData) {
  const memorialId = formText(formData, "__memorialId");
  const brief = formText(formData, "brief");
  if (!memorialId || !brief) redirect("/dashboard?error=invalid");
  return submitGriefRequest(memorialId, brief);
}

export async function submitGriefRequest(memorialId: string, brief: string) {
  const memorial = await requireKeeperForMemorial(memorialId);

  const session = await getServerSession(getAuthOptions());
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;
  if (!userId) redirect("/sign-in");

  await prisma.ilmGriefRequest.create({
    data: {
      memorialId,
      requesterId: userId,
      brief: brief.trim(),
      status: "OPEN",
    },
  });

  revalidatePath(`/dashboard/memorials/${memorialId}/community`);
}

export async function setMediaStatus(memorialId: string, mediaId: string, status: IlmSubmissionStatus) {
  const memorial = await requireKeeperForMemorial(memorialId);

  const media = await prisma.ilmMedia.findFirst({
    where: { id: mediaId, memorialId },
  });

  if (!media) {
    redirect(`/dashboard/memorials/${memorialId}/community`);
  }

  await prisma.ilmMedia.update({
    where: { id: mediaId },
    data: { status },
  });

  revalidatePath(`/memorial/${memorial.slug}`);
  revalidatePath(`/dashboard/memorials/${memorialId}/community`);
  redirect(`/dashboard/memorials/${memorialId}/community`);
}
