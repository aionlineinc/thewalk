"use server";

import { IlmMemorialKind, IlmPrivacyLevel } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { getAuthOptions } from "@/lib/auth";
import { allocateUniqueSlug } from "@/lib/ilm-slug";
import { prisma } from "@/lib/prisma";

function parseOptionalDate(s: FormDataEntryValue | null): Date | undefined {
  if (s == null || typeof s !== "string" || !s.trim()) return undefined;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

const memorialBodySchema = z.object({
  displayName: z.string().trim().min(1, "Name is required").max(200),
  kind: z.nativeEnum(IlmMemorialKind),
  biography: z.string().max(50000).optional(),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  privacyLevel: z.nativeEnum(IlmPrivacyLevel),
  country: z.string().max(100).optional(),
  parish: z.string().max(100).optional(),
  themePreset: z.string().max(50).optional(),
  primaryColor: z.string().max(7).optional(),
  accentColor: z.string().max(7).optional(),
  bannerPreset: z.string().max(50).optional(),
});

async function requireKeeperSession() {
  const session = await getServerSession(getAuthOptions());
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;
  if (!userId) redirect("/sign-in");
  return userId;
}

export async function createMemorial(formData: FormData) {
  const userId = await requireKeeperSession();

  const parsed = memorialBodySchema.safeParse({
    displayName: formData.get("displayName"),
    kind: formData.get("kind"),
    biography: (formData.get("biography") as string) || undefined,
    birthDate: (formData.get("birthDate") as string) || undefined,
    deathDate: (formData.get("deathDate") as string) || undefined,
    privacyLevel: formData.get("privacyLevel"),
    country: (formData.get("country") as string) || undefined,
    parish: (formData.get("parish") as string) || undefined,
    themePreset: (formData.get("themePreset") as string) || undefined,
    primaryColor: (formData.get("primaryColor") as string) || undefined,
    accentColor: (formData.get("accentColor") as string) || undefined,
    bannerPreset: (formData.get("bannerPreset") as string) || undefined,
  });

  if (!parsed.success) {
    redirect("/dashboard/memorials/new?error=validation");
  }

  const { displayName, kind, biography, privacyLevel, country, parish, themePreset, primaryColor, accentColor, bannerPreset } = parsed.data;
  const birthDate = parseOptionalDate(formData.get("birthDate"));
  const deathDate = parseOptionalDate(formData.get("deathDate"));
  const hideFromDirectory = formData.get("hideFromDirectory") === "on";
  const hideFromSearchEngines = formData.get("hideFromSearchEngines") === "on";

  const slug = await allocateUniqueSlug(displayName);

  await prisma.ilmMemorial.create({
    data: {
      slug,
      displayName,
      kind,
      biography: biography?.trim() || null,
      birthDate: birthDate ?? null,
      deathDate: deathDate ?? null,
      country: country?.trim() || null,
      parish: parish?.trim() || null,
      themePreset: themePreset?.trim() || null,
      primaryColor: primaryColor?.trim() || null,
      accentColor: accentColor?.trim() || null,
      bannerPreset: bannerPreset?.trim() || null,
      privacyLevel,
      hideFromDirectory,
      hideFromSearchEngines,
      pageKeeperId: userId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/directory");
  revalidatePath(`/memorial/${slug}`);
  redirect(`/memorial/${slug}`);
}

const updateSchema = memorialBodySchema;

/** Used by the edit form — do not use `.bind()` on server actions (breaks Next standalone bundles). */
export async function updateMemorialFromForm(formData: FormData) {
  const rawId = formData.get("__memorialId");
  const memorialId = typeof rawId === "string" ? rawId.trim() : "";
  if (!memorialId) {
    redirect("/dashboard?error=invalid");
  }
  return updateMemorial(memorialId, formData);
}

export async function updateMemorial(memorialId: string, formData: FormData) {
  const userId = await requireKeeperSession();

  const memorial = await prisma.ilmMemorial.findUnique({
    where: { id: memorialId },
    select: { id: true, slug: true, pageKeeperId: true },
  });

  if (!memorial || memorial.pageKeeperId !== userId) {
    redirect("/dashboard?error=forbidden");
  }

  const parsed = updateSchema.safeParse({
    displayName: formData.get("displayName"),
    kind: formData.get("kind"),
    biography: (formData.get("biography") as string) || undefined,
    birthDate: (formData.get("birthDate") as string) || undefined,
    deathDate: (formData.get("deathDate") as string) || undefined,
    privacyLevel: formData.get("privacyLevel"),
    country: (formData.get("country") as string) || undefined,
    parish: (formData.get("parish") as string) || undefined,
    themePreset: (formData.get("themePreset") as string) || undefined,
    primaryColor: (formData.get("primaryColor") as string) || undefined,
    accentColor: (formData.get("accentColor") as string) || undefined,
    bannerPreset: (formData.get("bannerPreset") as string) || undefined,
  });

  if (!parsed.success) {
    redirect(`/dashboard/memorials/${memorialId}/edit?error=validation`);
  }

  const { displayName, kind, biography, privacyLevel, country, parish, themePreset, primaryColor, accentColor, bannerPreset } = parsed.data;
  const birthDate = parseOptionalDate(formData.get("birthDate"));
  const deathDate = parseOptionalDate(formData.get("deathDate"));
  const hideFromDirectory = formData.get("hideFromDirectory") === "on";
  const hideFromSearchEngines = formData.get("hideFromSearchEngines") === "on";

  await prisma.ilmMemorial.update({
    where: { id: memorialId },
    data: {
      displayName,
      kind,
      biography: biography?.trim() || null,
      birthDate: birthDate ?? null,
      deathDate: deathDate ?? null,
      country: country?.trim() || null,
      parish: parish?.trim() || null,
      themePreset: themePreset?.trim() || null,
      primaryColor: primaryColor?.trim() || null,
      accentColor: accentColor?.trim() || null,
      bannerPreset: bannerPreset?.trim() || null,
      privacyLevel,
      hideFromDirectory,
      hideFromSearchEngines,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/directory");
  revalidatePath(`/memorial/${memorial.slug}`);
  redirect(`/memorial/${memorial.slug}`);
}

/** Standalone-safe: hidden `__memorialId` replaces `.bind(null, id)`. */
export async function deleteMemorialFromForm(formData: FormData) {
  const rawId = formData.get("__memorialId");
  const memorialId = typeof rawId === "string" ? rawId.trim() : "";
  if (!memorialId) redirect("/dashboard?error=invalid");
  return deleteMemorial(memorialId);
}

export async function deleteMemorial(memorialId: string) {
  const userId = await requireKeeperSession();

  const memorial = await prisma.ilmMemorial.findUnique({
    where: { id: memorialId },
    select: { pageKeeperId: true, slug: true },
  });

  if (!memorial || memorial.pageKeeperId !== userId) {
    redirect("/dashboard?error=forbidden");
  }

  await prisma.ilmMemorial.delete({ where: { id: memorialId } });

  revalidatePath("/dashboard");
  revalidatePath("/directory");
  revalidatePath(`/memorial/${memorial.slug}`);
  redirect("/dashboard");
}
