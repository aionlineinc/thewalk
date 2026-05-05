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
  });

  if (!parsed.success) {
    redirect("/dashboard/memorials/new?error=validation");
  }

  const { displayName, kind, biography, privacyLevel } = parsed.data;
  const birthDate = parseOptionalDate(formData.get("birthDate"));
  const deathDate = parseOptionalDate(formData.get("deathDate"));

  const slug = await allocateUniqueSlug(displayName);

  await prisma.ilmMemorial.create({
    data: {
      slug,
      displayName,
      kind,
      biography: biography?.trim() || null,
      birthDate: birthDate ?? null,
      deathDate: deathDate ?? null,
      privacyLevel,
      pageKeeperId: userId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/memorial/${slug}`);
  redirect(`/memorial/${slug}`);
}

const updateSchema = memorialBodySchema;

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
  });

  if (!parsed.success) {
    redirect(`/dashboard/memorials/${memorialId}/edit?error=validation`);
  }

  const { displayName, kind, biography, privacyLevel } = parsed.data;
  const birthDate = parseOptionalDate(formData.get("birthDate"));
  const deathDate = parseOptionalDate(formData.get("deathDate"));

  await prisma.ilmMemorial.update({
    where: { id: memorialId },
    data: {
      displayName,
      kind,
      biography: biography?.trim() || null,
      birthDate: birthDate ?? null,
      deathDate: deathDate ?? null,
      privacyLevel,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/memorial/${memorial.slug}`);
  redirect(`/memorial/${memorial.slug}`);
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
  revalidatePath(`/memorial/${memorial.slug}`);
  redirect("/dashboard");
}
