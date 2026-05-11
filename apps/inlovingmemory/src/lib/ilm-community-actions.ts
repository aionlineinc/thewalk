"use server";

import { IlmSubmissionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const guestbookSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60).optional(),
  lastName: z.string().trim().min(1, "Last name is required").max(60).optional(),
  authorName: z.string().trim().min(1, "Name is required").max(120).optional(),
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

  const rawFirst = formData.get("firstName");
  const rawLast = formData.get("lastName");
  const rawName = formData.get("authorName");
  const combinedName =
    rawFirst || rawLast
      ? `${String(rawFirst ?? "").trim()} ${String(rawLast ?? "").trim()}`.trim()
      : rawName;

  const parsed = guestbookSchema.safeParse({
    firstName: rawFirst,
    lastName: rawLast,
    authorName: combinedName,
    authorEmail: formData.get("authorEmail"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    redirect(`/memorial/${slug}?guestbook=invalid`);
  }

  const resolvedName =
    parsed.data.firstName && parsed.data.lastName
      ? `${parsed.data.firstName} ${parsed.data.lastName}`
      : (parsed.data.authorName ?? "Anonymous");

  if (!resolvedName) {
    redirect(`/memorial/${slug}?guestbook=invalid`);
  }

  const email = parsed.data.authorEmail?.trim();
  await prisma.ilmGuestbookEntry.create({
    data: {
      memorialId: memorial.id,
      authorName: resolvedName,
      authorEmail: email || null,
      content: parsed.data.content,
      status: IlmSubmissionStatus.PENDING,
    },
  });

  revalidatePath(`/memorial/${slug}`);
  redirect(`/memorial/${slug}?guestbook=sent`);
}

/** Standalone-safe: do not use `.bind()` on server actions. Slug is passed via hidden `__ilmSlug`. */
export async function submitGuestbookFromForm(formData: FormData) {
  const raw = formData.get("__ilmSlug");
  const slug = typeof raw === "string" ? raw.trim() : "";
  if (!slug) redirect("/?guestbook=invalid");
  return submitGuestbookEntry(slug, formData);
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

/** Standalone-safe: hidden `__ilmSlug` replaces `.bind(null, slug)`. */
export async function submitPrayerFromForm(formData: FormData) {
  const raw = formData.get("__ilmSlug");
  const slug = typeof raw === "string" ? raw.trim() : "";
  if (!slug) redirect("/?prayer=invalid");
  return submitPrayer(slug, formData);
}

export async function submitVideoEulogy(slug: string, formData: FormData) {
  const videoUrl = (formData.get("videoUrl") as string)?.trim();
  const authorName = (formData.get("authorName") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!videoUrl || !authorName) {
    redirect(`/memorial/${slug}?video=invalid`);
  }

  // Validate it's a YouTube or Vimeo URL
  let u: URL;
  try { u = new URL(videoUrl); } catch {
    redirect(`/memorial/${slug}?video=invalid`);
  }
  const isYouTube = u.hostname.includes("youtube.com") || u.hostname === "youtu.be";
  const isVimeo = u.hostname.includes("vimeo.com");
  if (!isYouTube && !isVimeo) {
    redirect(`/memorial/${slug}?video=invalid`);
  }

  const memorial = await prisma.ilmMemorial.findUnique({
    where: { slug },
    select: { id: true, privacyLevel: true },
  });

  if (!memorial || memorial.privacyLevel !== "PUBLIC") {
    redirect(`/memorial/${slug}?video=closed`);
  }

  await prisma.ilmMedia.create({
    data: {
      memorialId: memorial.id,
      kind: "VIDEO",
      storageUrl: videoUrl,
      authorGuestName: authorName,
      title: message || null,
      status: "PENDING",
    },
  });

  revalidatePath(`/memorial/${slug}`);
}

export async function submitVideoEulogyFromForm(formData: FormData) {
  const slug = (formData.get("__ilmSlug") as string)?.trim();
  if (!slug) redirect("/");
  return submitVideoEulogy(slug, formData);
}
