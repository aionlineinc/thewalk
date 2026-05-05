"use server";

import { IlmSubmissionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const guestbookSchema = z.object({
  authorName: z.string().trim().min(1, "Name is required").max(120),
  authorEmail: z.preprocess(
    (v) => (v === "" || v == null || typeof v !== "string" ? undefined : v.trim()),
    z.string().email().max(320).optional(),
  ),
  content: z.string().trim().min(1, "Message is required").max(5000),
});

const prayerSchema = z.object({
  authorName: z.string().trim().min(1, "Name is required").max(120),
  authorEmail: z.preprocess(
    (v) => (v === "" || v == null || typeof v !== "string" ? undefined : v.trim()),
    z.string().email().max(320).optional(),
  ),
  content: z.string().trim().min(1, "Prayer is required").max(5000),
});

export async function submitGuestbookEntry(slug: string, formData: FormData) {
  const memorial = await prisma.ilmMemorial.findUnique({
    where: { slug },
    select: { id: true, privacyLevel: true },
  });

  if (!memorial || memorial.privacyLevel !== "PUBLIC") {
    redirect(`/memorial/${slug}?guestbook=closed`);
  }

  const parsed = guestbookSchema.safeParse({
    authorName: formData.get("authorName"),
    authorEmail: formData.get("authorEmail"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    redirect(`/memorial/${slug}?guestbook=invalid`);
  }

  const email = parsed.data.authorEmail?.trim();
  await prisma.ilmGuestbookEntry.create({
    data: {
      memorialId: memorial.id,
      authorName: parsed.data.authorName,
      authorEmail: email || null,
      content: parsed.data.content,
      status: IlmSubmissionStatus.PENDING,
    },
  });

  revalidatePath(`/memorial/${slug}`);
  redirect(`/memorial/${slug}?guestbook=sent`);
}

export async function submitPrayer(slug: string, formData: FormData) {
  const memorial = await prisma.ilmMemorial.findUnique({
    where: { slug },
    select: { id: true, privacyLevel: true },
  });

  if (!memorial || memorial.privacyLevel !== "PUBLIC") {
    redirect(`/memorial/${slug}?prayer=closed`);
  }

  const notifyRaw = formData.get("notifyAuthor");
  const notifyAuthor = notifyRaw === "on" || notifyRaw === "true";

  const parsed = prayerSchema.safeParse({
    authorName: formData.get("authorName"),
    authorEmail: formData.get("authorEmail"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    redirect(`/memorial/${slug}?prayer=invalid`);
  }

  const email = parsed.data.authorEmail?.trim();
  await prisma.ilmPrayer.create({
    data: {
      memorialId: memorial.id,
      authorName: parsed.data.authorName,
      authorEmail: email || null,
      content: parsed.data.content,
      notifyAuthor,
      status: IlmSubmissionStatus.PENDING,
    },
  });

  revalidatePath(`/memorial/${slug}`);
  redirect(`/memorial/${slug}?prayer=sent`);
}
