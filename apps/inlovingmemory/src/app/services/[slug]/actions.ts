"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function submitOrder(slug: string, formData: FormData) {
  const customerName = (formData.get("customerName") as string)?.trim();
  const customerEmail = (formData.get("customerEmail") as string)?.trim();
  const customerPhone = (formData.get("customerPhone") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const amountStr = (formData.get("amount") as string)?.trim();

  if (!customerName || !customerEmail) {
    redirect(`/services/${slug}?error=invalid`);
  }

  const provider = await prisma.ilmServiceProvider.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!provider) {
    redirect(`/services/${slug}?error=invalid`);
  }

  const amount = amountStr ? parseFloat(amountStr) : null;

  await prisma.ilmServiceOrder.create({
    data: {
      providerId: provider.id,
      customerName,
      customerEmail,
      customerPhone,
      description,
      amount: amount && !isNaN(amount) ? amount : null,
      status: "PENDING",
    },
  });

  revalidatePath(`/services/${slug}`);
  redirect(`/services/${slug}?order=sent`);
}
