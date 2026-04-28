import type { PrismaClient } from "@prisma/client";
import { GroupRegistrationStatus } from "@prisma/client";
import { z } from "zod";
import type { Result } from "@/modules/_shared/result";
import { err, ok } from "@/modules/_shared/result";
import type { AppError } from "@/modules/_shared/errors";
import { notFound, validation } from "@/modules/_shared/errors";
import type { OrganizationsService } from "@/modules/organizations";
import type { OutboxService } from "@/modules/outbox";
import type { GroupRegistrationDTO } from "./types";

export type GroupRegistrationService = {
  submit(input: {
    organizationName: string;
    desiredSlug?: string;
    contactName: string;
    contactEmail: string;
    phone?: string;
    notes?: string;
  }): Promise<Result<{ registrationId: string }, AppError>>;

  approve(input: { registrationId: string }): Promise<Result<{ organizationId: string }, AppError>>;
  reject(input: { registrationId: string }): Promise<Result<{ ok: true }, AppError>>;
};

const submitSchema = z.object({
  organizationName: z.string().min(2).max(200).trim(),
  desiredSlug: z
    .string()
    .min(2)
    .max(80)
    .trim()
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers, and dashes.")
    .optional(),
  contactName: z.string().min(2).max(120).trim(),
  contactEmail: z.string().email().max(320).trim().toLowerCase(),
  phone: z.string().max(40).trim().optional(),
  notes: z.string().max(4000).trim().optional(),
});

const idSchema = z.object({ registrationId: z.string().uuid() });

function toDto(r: any): GroupRegistrationDTO {
  return {
    id: r.id,
    organizationName: r.organizationName,
    desiredSlug: r.desiredSlug ?? undefined,
    contactName: r.contactName,
    contactEmail: r.contactEmail,
    phone: r.phone ?? undefined,
    notes: r.notes ?? undefined,
    status: r.status,
    reviewedAt: r.reviewedAt ?? undefined,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export function createGroupRegistrationService(deps: {
  prisma: PrismaClient;
  organizations: OrganizationsService;
  outbox?: OutboxService;
}): GroupRegistrationService {
  return {
    async submit(input) {
      const parsed = submitSchema.safeParse({
        ...input,
        desiredSlug:
          input.desiredSlug == null || (typeof input.desiredSlug === "string" && input.desiredSlug.trim() === "")
            ? undefined
            : input.desiredSlug,
        phone: input.phone && input.phone.trim() ? input.phone : undefined,
        notes: input.notes && input.notes.trim() ? input.notes : undefined,
      });
      if (!parsed.success) return err(validation(parsed.error.issues[0]?.message ?? "Invalid input"));

      const created = await deps.prisma.$transaction(async (tx) => {
        const reg = await tx.groupRegistration.create({
          data: {
            organizationName: parsed.data.organizationName,
            desiredSlug: parsed.data.desiredSlug ?? null,
            contactName: parsed.data.contactName,
            contactEmail: parsed.data.contactEmail,
            phone: parsed.data.phone ?? null,
            notes: parsed.data.notes ?? null,
          },
          select: { id: true },
        });

        if (deps.outbox) {
          await deps.outbox.enqueue(tx as any, {
            type: "GroupRegistrationSubmitted",
            aggregateType: "GroupRegistration",
            aggregateId: reg.id,
            payload: { registrationId: reg.id },
          });
        }

        return reg;
      });

      return ok({ registrationId: created.id });
    },

    async approve(input) {
      const parsed = idSchema.safeParse(input);
      if (!parsed.success) return err(validation("Invalid request"));

      const reg = await deps.prisma.groupRegistration.findUnique({ where: { id: parsed.data.registrationId } });
      if (!reg || reg.status !== GroupRegistrationStatus.PENDING) {
        return err(notFound("Registration not found or already processed."));
      }

      const baseSlug = reg.desiredSlug?.trim() || reg.organizationName;
      const slug = await deps.organizations.ensureUniqueSlug(baseSlug);

      const created = await deps.prisma.$transaction(async (tx) => {
        const org = await tx.organization.create({
          data: { name: reg.organizationName, slug, kind: "organization" },
          select: { id: true },
        });
        await tx.groupRegistration.update({
          where: { id: reg.id },
          data: { status: GroupRegistrationStatus.APPROVED, reviewedAt: new Date() },
        });

        if (deps.outbox) {
          await deps.outbox.enqueue(tx as any, {
            type: "GroupRegistrationApproved",
            aggregateType: "GroupRegistration",
            aggregateId: reg.id,
            payload: { registrationId: reg.id, organizationId: org.id },
          });
        }

        return org;
      });

      return ok({ organizationId: created.id });
    },

    async reject(input) {
      const parsed = idSchema.safeParse(input);
      if (!parsed.success) return err(validation("Invalid request"));

      const reg = await deps.prisma.groupRegistration.findUnique({ where: { id: parsed.data.registrationId } });
      if (!reg || reg.status !== GroupRegistrationStatus.PENDING) {
        return err(notFound("Registration not found or already processed."));
      }

      await deps.prisma.$transaction(async (tx) => {
        await tx.groupRegistration.update({
          where: { id: reg.id },
          data: { status: GroupRegistrationStatus.REJECTED, reviewedAt: new Date() },
        });
        if (deps.outbox) {
          await deps.outbox.enqueue(tx as any, {
            type: "GroupRegistrationRejected",
            aggregateType: "GroupRegistration",
            aggregateId: reg.id,
            payload: { registrationId: reg.id },
          });
        }
      });

      return ok({ ok: true });
    },
  };
}

