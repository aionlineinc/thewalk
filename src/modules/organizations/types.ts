import type { UserRole } from "@prisma/client";

export type OrganizationDTO = {
  id: string;
  name: string;
  slug: string;
  kind: string;
};

export type OrganizationMembershipDTO = {
  id: string;
  userId: string;
  organizationId: string;
  role: UserRole;
};

