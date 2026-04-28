import bcrypt from "bcryptjs";
import type { PrismaClient, UserRole } from "@prisma/client";
import { UserRole as PrismaUserRole } from "@prisma/client";
import { z } from "zod";
import type { Result } from "@/modules/_shared/result";
import { err, ok } from "@/modules/_shared/result";
import type { AppError } from "@/modules/_shared/errors";
import { conflict, notFound, validation } from "@/modules/_shared/errors";
import type { UserDTO } from "./types";

export type IdentityService = {
  signup(input: { email: string; password: string; name?: string }): Promise<Result<{ user: UserDTO }, AppError>>;
  updateUserRole(input: { userId: string; role: UserRole }): Promise<Result<{ ok: true }, AppError>>;
  upsertSuperAdmin(input: {
    email: string;
    password: string;
    name?: string;
  }): Promise<Result<{ user: { id: string; email: string; role: UserRole; createdAt: Date; updatedAt: Date } }, AppError>>;
  canBootstrapWithoutSecret(input: { email: string }): Promise<boolean>;
};

const signupSchema = z.object({
  email: z
    .string()
    .email()
    .max(320)
    .transform((s) => s.trim().toLowerCase()),
  password: z.string().min(8).max(200),
  name: z.string().max(120).optional(),
});

const updateRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.string().min(1) as z.ZodType<UserRole>,
});

const bootstrapSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(200),
  name: z.string().max(120).optional(),
});

export function createIdentityService(deps: { prisma: PrismaClient }): IdentityService {
  return {
    async signup(input) {
      const parsed = signupSchema.safeParse(input);
      if (!parsed.success) return err(validation(parsed.error.issues[0]?.message ?? "Invalid input"));

      const { email, password, name } = parsed.data;

      const existing = await deps.prisma.user.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
        select: { id: true },
      });
      if (existing) return err(conflict("Email already in use"));

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await deps.prisma.user.create({
        data: {
          email,
          name: name?.trim() ? name.trim() : null,
          passwordHash,
        },
        select: { id: true, email: true, name: true, role: true, createdAt: true },
      });

      return ok({
        user: {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    },

    async updateUserRole(input) {
      const parsed = updateRoleSchema.safeParse(input);
      if (!parsed.success) return err(validation(parsed.error.issues[0]?.message ?? "Invalid input"));

      const user = await deps.prisma.user.findUnique({ where: { id: parsed.data.userId }, select: { id: true } });
      if (!user) return err(notFound("User not found"));

      await deps.prisma.user.update({
        where: { id: parsed.data.userId },
        data: { role: parsed.data.role },
        select: { id: true },
      });

      return ok({ ok: true });
    },

    async upsertSuperAdmin(input) {
      const parsed = bootstrapSchema.safeParse(input);
      if (!parsed.success) return err(validation("Invalid payload"));

      const passwordHash = await bcrypt.hash(parsed.data.password, 12);
      const user = await deps.prisma.user.upsert({
        where: { email: parsed.data.email },
        create: {
          email: parsed.data.email,
          name: parsed.data.name?.trim() ? parsed.data.name.trim() : null,
          passwordHash,
          role: PrismaUserRole.SUPER_ADMIN,
        },
        update: {
          passwordHash,
          role: PrismaUserRole.SUPER_ADMIN,
          name: parsed.data.name?.trim() ? parsed.data.name.trim() : undefined,
        },
        select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
      });

      return ok({ user });
    },

    async canBootstrapWithoutSecret(input) {
      const email = input.email.trim().toLowerCase();
      const existingAdmins = await deps.prisma.user.count({ where: { role: PrismaUserRole.SUPER_ADMIN } });
      if (existingAdmins > 0) return false;
      return email === "andreifill@thewalk.org";
    },
  };
}

