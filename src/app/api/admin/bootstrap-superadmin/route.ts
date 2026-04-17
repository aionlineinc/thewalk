import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

const bodySchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(200),
  name: z.string().max(120).optional(),
});

export async function POST(req: Request) {
  const secret = req.headers.get("x-bootstrap-secret") ?? "";
  if (!process.env.BOOTSTRAP_SECRET || secret !== process.env.BOOTSTRAP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { email, password, name } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: name?.trim() ? name.trim() : null,
      passwordHash,
      role: UserRole.SUPER_ADMIN,
    },
    update: {
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      name: name?.trim() ? name.trim() : undefined,
    },
    select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
  });

  return NextResponse.json({ ok: true, user });
}

