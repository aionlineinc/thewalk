"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IlmMediaKind } from "@prisma/client";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireVaultAccess(memorialId: string) {
  const session = await getServerSession(getAuthOptions());
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;
  if (!userId) redirect("/sign-in");

  const memorial = await prisma.ilmMemorial.findUnique({
    where: { id: memorialId },
    select: { pageKeeperId: true },
  });

  if (!memorial || memorial.pageKeeperId !== userId) {
    redirect("/dashboard?error=forbidden");
  }

  return userId;
}

async function getOrCreateVault(memorialId: string, ownerId: string) {
  const existing = await prisma.ilmGenerationsVault.findUnique({
    where: { linkedMemorialId: memorialId },
  });
  if (existing) return existing;

  return prisma.ilmGenerationsVault.create({
    data: { linkedMemorialId: memorialId, ownerId },
  });
}

export async function createCollection(formData: FormData) {
  const memorialId = (formData.get("memorialId") as string) || "";
  const userId = await requireVaultAccess(memorialId);

  const name = (formData.get("name") as string)?.trim();
  if (!name || name.length > 200) redirect(`/dashboard/memorials/${memorialId}/vault?error=validation`);

  const vault = await getOrCreateVault(memorialId, userId);

  await prisma.ilmVaultCollection.create({
    data: { vaultId: vault.id, name },
  });

  revalidatePath(`/dashboard/memorials/${memorialId}/vault`);
  redirect(`/dashboard/memorials/${memorialId}/vault`);
}

export async function renameCollection(formData: FormData) {
  const memorialId = (formData.get("memorialId") as string) || "";
  await requireVaultAccess(memorialId);

  const collectionId = (formData.get("collectionId") as string) || "";
  const name = (formData.get("name") as string)?.trim();
  if (!name || !collectionId) redirect(`/dashboard/memorials/${memorialId}/vault?error=validation`);

  await prisma.ilmVaultCollection.update({
    where: { id: collectionId },
    data: { name },
  });

  revalidatePath(`/dashboard/memorials/${memorialId}/vault`);
}

export async function deleteCollection(formData: FormData) {
  const memorialId = (formData.get("memorialId") as string) || "";
  await requireVaultAccess(memorialId);

  const collectionId = (formData.get("collectionId") as string) || "";
  if (!collectionId) redirect(`/dashboard/memorials/${memorialId}/vault?error=validation`);

  await prisma.ilmVaultCollection.delete({ where: { id: collectionId } });

  revalidatePath(`/dashboard/memorials/${memorialId}/vault`);
  redirect(`/dashboard/memorials/${memorialId}/vault`);
}

export async function addItemToCollection(formData: FormData) {
  const memorialId = (formData.get("memorialId") as string) || "";
  await requireVaultAccess(memorialId);

  const collectionId = (formData.get("collectionId") as string) || "";
  const storageUrl = (formData.get("storageUrl") as string)?.trim() || "";
  if (!collectionId || !storageUrl) redirect(`/dashboard/memorials/${memorialId}/vault/collections/${collectionId}?error=validation`);

  const kind = (formData.get("kind") as string) || "DOCUMENT";
  const title = (formData.get("title") as string)?.trim() || null;

  const vaultKind = (Object.values(IlmMediaKind) as string[]).includes(kind)
    ? (kind as IlmMediaKind)
    : IlmMediaKind.DOCUMENT;

  await prisma.ilmVaultItem.create({
    data: { collectionId, kind: vaultKind, storageUrl, title },
  });

  revalidatePath(`/dashboard/memorials/${memorialId}/vault/collections/${collectionId}`);
}

export async function deleteVaultItem(formData: FormData) {
  const memorialId = (formData.get("memorialId") as string) || "";
  await requireVaultAccess(memorialId);

  const itemId = (formData.get("itemId") as string) || "";
  if (!itemId) return;

  const vault = await prisma.ilmGenerationsVault.findUnique({
    where: { linkedMemorialId: memorialId },
    select: { id: true },
  });

  const item = await prisma.ilmVaultItem.findUnique({
    where: { id: itemId },
    select: { collection: { select: { vaultId: true } } },
  });

  if (vault && item && item.collection.vaultId === vault.id) {
    await prisma.ilmVaultItem.delete({ where: { id: itemId } });
  }

  revalidatePath(`/dashboard/memorials/${memorialId}/vault`);
}

export async function inviteMember(formData: FormData) {
  const memorialId = (formData.get("memorialId") as string) || "";
  const userId = await requireVaultAccess(memorialId);

  const email = (formData.get("email") as string)?.trim().toLowerCase() || "";
  const role = (formData.get("role") as string) || "FAMILY_VIEWER";
  if (!email) redirect(`/dashboard/memorials/${memorialId}/vault/members?error=email`);

  const vault = await getOrCreateVault(memorialId, userId);

  // Find the user by email
  const targetUser = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true },
  });
  if (!targetUser) redirect(`/dashboard/memorials/${memorialId}/vault/members?error=not_found`);

  // Prevent inviting self (already owner)
  if (targetUser.id === userId) redirect(`/dashboard/memorials/${memorialId}/vault/members?error=self`);

  const roleEnum = z.enum(["VAULT_OWNER", "GENERATIONS_GUARDIAN", "BACKUP_GUARDIAN", "FAMILY_EDITOR", "FAMILY_VIEWER", "SECTION_KEEPER"]);
  const parsedRole = roleEnum.safeParse(role);
  if (!parsedRole.success) redirect(`/dashboard/memorials/${memorialId}/vault/members?error=role`);

  // Upsert to handle re-invites gracefully
  await prisma.ilmVaultMember.upsert({
    where: { vaultId_userId: { vaultId: vault.id, userId: targetUser.id } },
    update: { role: parsedRole.data },
    create: { vaultId: vault.id, userId: targetUser.id, role: parsedRole.data },
  });

  revalidatePath(`/dashboard/memorials/${memorialId}/vault/members`);
  redirect(`/dashboard/memorials/${memorialId}/vault/members`);
}

export async function removeMember(formData: FormData) {
  const memorialId = (formData.get("memorialId") as string) || "";
  await requireVaultAccess(memorialId);

  const memberId = (formData.get("memberId") as string) || "";
  if (!memberId) return;

  const vault = await prisma.ilmGenerationsVault.findUnique({
    where: { linkedMemorialId: memorialId },
    select: { id: true },
  });

  if (vault) {
    const member = await prisma.ilmVaultMember.findUnique({
      where: { id: memberId },
      select: { vaultId: true },
    });

    if (member && member.vaultId === vault.id) {
      await prisma.ilmVaultMember.delete({ where: { id: memberId } });
    }
  }

  revalidatePath(`/dashboard/memorials/${memorialId}/vault/members`);
}

export async function createMessage(formData: FormData) {
  const memorialId = (formData.get("memorialId") as string) || "";
  const userId = await requireVaultAccess(memorialId);

  const vault = await getOrCreateVault(memorialId, userId);

  const recipientEmail = (formData.get("recipientEmail") as string)?.trim() || "";
  const body = (formData.get("body") as string)?.trim() || "";
  if (!body) redirect(`/dashboard/memorials/${memorialId}/vault/messages/new?error=body`);

  await prisma.ilmVaultMessage.create({
    data: {
      vaultId: vault.id,
      recipientEmail: recipientEmail || null,
      body,
    },
  });

  revalidatePath(`/dashboard/memorials/${memorialId}/vault/messages`);
  redirect(`/dashboard/memorials/${memorialId}/vault/messages`);
}
