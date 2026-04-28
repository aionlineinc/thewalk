import { prisma } from "@/lib/prisma";
import { createIdentityService } from "@/modules/identity";
import { createOrganizationsService } from "@/modules/organizations";
import { createGroupRegistrationService } from "@/modules/groupRegistration";
import { createScriptureService } from "@/modules/scripture";
import { checkDbHealth } from "@/modules/platform";
import { createOutboxService } from "@/modules/outbox";

export function identityService() {
  return createIdentityService({ prisma });
}

export function organizationsService() {
  return createOrganizationsService({ prisma });
}

export function groupRegistrationService() {
  const organizations = organizationsService();
  const outbox = outboxService();
  return createGroupRegistrationService({ prisma, organizations, outbox });
}

export function scriptureService() {
  return createScriptureService();
}

export function checkDb() {
  return checkDbHealth(prisma);
}

export function outboxService() {
  // Default in-process delivery: currently a noop (future: wire to real subscribers/webhooks).
  return createOutboxService({
    prisma,
    deliver: async () => {},
  });
}

