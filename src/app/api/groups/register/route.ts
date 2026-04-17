import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  organizationName: z.string().min(2).max(200).trim(),
  desiredSlug: z.preprocess(
    (v) => (v == null || (typeof v === "string" && v.trim() === "") ? undefined : v),
    z
      .string()
      .min(2)
      .max(80)
      .trim()
      .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers, and dashes.")
      .optional()
  ),
  contactName: z.string().min(2).max(120).trim(),
  contactEmail: z.string().email().max(320).trim().toLowerCase(),
  phone: z.string().max(40).trim().optional().or(z.literal("")),
  notes: z.string().max(4000).trim().optional().or(z.literal("")),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { organizationName, desiredSlug, contactName, contactEmail, phone, notes } = parsed.data;

  await prisma.groupRegistration.create({
    data: {
      organizationName,
      desiredSlug: desiredSlug || null,
      contactName,
      contactEmail,
      phone: phone || null,
      notes: notes || null,
    },
  });

  return NextResponse.json({ ok: true });
}
