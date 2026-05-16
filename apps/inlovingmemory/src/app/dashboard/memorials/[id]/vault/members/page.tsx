import Link from "next/link";
import { notFound } from "next/navigation";
import { getIlmSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MemorialSubNav } from "@/components/dashboard/memorial-sub-nav";
import { inviteMember, removeMember } from "../actions";

export const metadata = { title: "Vault members · inLovingMemory" };

const roleLabels: Record<string, string> = {
  VAULT_OWNER: "Owner",
  GENERATIONS_GUARDIAN: "Guardian",
  BACKUP_GUARDIAN: "Backup Guardian",
  FAMILY_EDITOR: "Editor",
  FAMILY_VIEWER: "Viewer",
  SECTION_KEEPER: "Section Keeper",
};

const inviteRoles = [
  { value: "FAMILY_VIEWER", label: "Viewer — Read-only access" },
  { value: "FAMILY_EDITOR", label: "Editor — Can add and edit content" },
  { value: "SECTION_KEEPER", label: "Section Keeper — Edit a specific collection" },
  { value: "GENERATIONS_GUARDIAN", label: "Guardian — Full vault access, successor" },
  { value: "BACKUP_GUARDIAN", label: "Backup Guardian — Secondary successor" },
];

export default async function VaultMembersPage({ params }: { params: { id: string } }) {
  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;

  const memorial = await prisma.ilmMemorial.findUnique({
    where: { id: params.id },
    select: { id: true, slug: true, displayName: true, pageKeeperId: true },
  });

  if (!memorial || memorial.pageKeeperId !== userId) notFound();

  const vault = await prisma.ilmGenerationsVault.findUnique({
    where: { linkedMemorialId: memorial.id },
    include: {
      members: {
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!vault) notFound();

  const errorParam = ""; // Could read from searchParams if needed

  return (
    <section className="w-full">
      <Link href={`/dashboard/memorials/${memorial.id}/vault`} className="dash-link text-sm">
        ← Vault
      </Link>
      <h1 className="dash-page-title mt-6">Members</h1>
      <p className="dash-page-lead">
        Control who has access to the vault for {memorial.displayName}.
      </p>
      <div className="mt-6">
        <MemorialSubNav memorialId={memorial.id} slug={memorial.slug} />
      </div>

      {/* Invite form */}
      <div className="dash-card-pad mt-6">
        <h2 className="text-sm font-semibold text-earth-900">Invite a member</h2>
        <form action={inviteMember} className="mt-3 flex flex-wrap gap-3">
          <input type="hidden" name="memorialId" value={memorial.id} />
          <input
            name="email"
            type="email"
            required
            placeholder="Email address"
            className="block rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
          />
          <select
            name="role"
            className="rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
          >
            {inviteRoles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-calm-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-calm-600"
          >
            Invite
          </button>
        </form>
      </div>

      {/* Members list */}
      {vault.members.length === 0 ? (
        <div className="dash-card-pad mt-6 text-center text-sm text-earth-500">
          No members invited yet.
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {vault.members.map((m) => {
            const isOwner = m.role === "VAULT_OWNER";
            return (
              <div key={m.id} className="dash-card-pad flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-earth-900">
                    {m.user.name || "Unknown"}
                  </span>
                  <span className="ml-2 text-sm text-earth-500">{m.user.email}</span>
                  <span className="ml-2 inline-block rounded bg-earth-100 px-1.5 py-0.5 text-xs text-earth-600">
                    {roleLabels[m.role] || m.role}
                  </span>
                </div>

                {!isOwner && (
                  <form action={removeMember}>
                    <input type="hidden" name="memorialId" value={memorial.id} />
                    <input type="hidden" name="memberId" value={m.id} />
                    <button
                      type="submit"
                      className="rounded-lg bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                    >
                      Remove
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
