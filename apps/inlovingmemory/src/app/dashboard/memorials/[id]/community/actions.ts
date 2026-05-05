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
