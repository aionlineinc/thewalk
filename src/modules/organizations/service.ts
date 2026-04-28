import type { PrismaClient, UserRole } from "@prisma/client";
import { z } from "zod";
import type { Result } from "@/modules/_shared/result";
import { err, ok } from "@/modules/_shared/result";
import type { AppError } from "@/modules/_shared/errors";
import { conflict, notFound, validation } from "@/modules/_shared/errors";
import type { OrganizationDTO, OrganizationMembershipDTO } from "./types";

export type OrganizationsService = {
  ensureUniqueSlug(baseSlug: string): Promise<string>;
  createOrganization(input: { name: string; slug: string; kind?: string }): Promise<Result<{ organization: OrganizationDTO }, AppError>>;
  addMembership(input: {
    userId: string;
    organizationId: string;
    role: UserRole;
  }): Promise<Result<{ membership: OrganizationMembershipDTO }, AppError>>;
  removeMembership(input: { membershipId: string }): Promise<Result<{ ok: true }, AppError>>;
};

function slugifyBase(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const createOrgSchema = z.object({
  name: z.string().min(2).max(200).trim(),
  slug: z.string().min(2).max(80).trim().regex(/^[a-z0-9-]+$/),
  kind: z.string().max(80).optional(),
});

const addMembershipSchema = z.object({
  userId: z.string().uuid(),
  organizationId: z.string().uuid(),
  role: z.string().min(1) as z.ZodType<UserRole>,
});

const removeMembershipSchema = z.object({
  membershipId: z.string().uuid(),
});

export function createOrganizationsService(deps: { prisma: PrismaClient }): OrganizationsService {
  return {
    async ensureUniqueSlug(baseSlug: string) {
      const base = slugifyBase(baseSlug) || "group";
      let slug = base;
      for (let n = 0; ; n += 1) {
        const clash = await deps.prisma.organization.findUnique({ where: { slug }, select: { id: true } });
        if (!clash) return slug;
        slug = `${base}-${n + 1}`;
      }
    },

    async createOrganization(input) {
      const parsed = createOrgSchema.safeParse(input);
      if (!parsed.success) return err(validation(parsed.error.issues[0]?.message ?? "Invalid input"));

      try {
        const org = await deps.prisma.organization.create({
          data: {
            name: parsed.data.name,
            slug: parsed.data.slug,
            kind: parsed.data.kind ?? "organization",
          },
          select: { id: true, name: true, slug: true, kind: true },
        });
        return ok({ organization: org });
      } catch {
        return err(conflict("Organization could not be created"));
      }
    },

    async addMembership(input) {
      const parsed = addMembershipSchema.safeParse(input);
      if (!parsed.success) return err(validation(parsed.error.issues[0]?.message ?? "Invalid input"));

      const user = await deps.prisma.user.findUnique({ where: { id: parsed.data.userId }, select: { id: true } });
      if (!user) return err(notFound("User not found"));
      const org = await deps.prisma.organization.findUnique({
        where: { id: parsed.data.organizationId },
        select: { id: true },
      });
      if (!org) return err(notFound("Organization not found"));

      try {
        const membership = await deps.prisma.organizationMembership.create({
          data: {
            userId: parsed.data.userId,
            organizationId: parsed.data.organizationId,
            role: parsed.data.role,
          },
          select: { id: true, userId: true, organizationId: true, role: true },
        });
        return ok({ membership });
      } catch {
        return err(conflict("Membership already exists for this user + org."));
      }
    },

    async removeMembership(input) {
      const parsed = removeMembershipSchema.safeParse(input);
      if (!parsed.success) return err(validation(parsed.error.issues[0]?.message ?? "Invalid input"));

      try {
        await deps.prisma.organizationMembership.delete({ where: { id: parsed.data.membershipId }, select: { id: true } });
      } catch {
        return err(notFound("Membership not found"));
      }

      return ok({ ok: true });
    },
  };
}

