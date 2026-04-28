import type { GroupRegistrationStatus } from "@prisma/client";

export type GroupRegistrationDTO = {
  id: string;
  organizationName: string;
  desiredSlug?: string;
  contactName: string;
  contactEmail: string;
  phone?: string;
  notes?: string;
  status: GroupRegistrationStatus;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

