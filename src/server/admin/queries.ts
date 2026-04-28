import { GroupRegistrationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function adminOverview() {
  const [usersCount, orgsCount, membershipsCount, pendingGroups, recentUsers, recentOrgs] = await Promise.all([
    prisma.user.count(),
    prisma.organization.count(),
    prisma.organizationMembership.count(),
    prisma.groupRegistration.count({ where: { status: GroupRegistrationStatus.PENDING } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    }),
    prisma.organization.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, slug: true, kind: true, createdAt: true, _count: { select: { memberships: true } } },
    }),
  ]);

  return { usersCount, orgsCount, membershipsCount, pendingGroups, recentUsers, recentOrgs };
}

export async function adminUsersPageData() {
  const [users, orgs] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        memberships: {
          select: {
            id: true,
            role: true,
            organization: { select: { id: true, name: true, slug: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.organization.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  return { users, orgs };
}

export async function adminOrganizationsPageData() {
  const orgs = await prisma.organization.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      kind: true,
      createdAt: true,
      _count: { select: { memberships: true } },
    },
  });
  return { orgs };
}

export async function adminGroupsPageData() {
  const rows = await prisma.groupRegistration.findMany({
    orderBy: { createdAt: "desc" },
  });
  return { rows };
}

