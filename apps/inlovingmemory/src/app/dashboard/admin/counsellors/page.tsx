import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getIlmSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Manage counsellors · inLovingMemory" };

const SPECIALISATION_LABELS: Record<string, string> = {
  BEREAVEMENT: "Bereavement & grief counselling",
  TRAUMA: "Trauma and loss",
  CHILD_BEREAVEMENT: "Child bereavement",
  SUDDEN_LOSS: "Sudden or violent loss",
  PREGNANCY_LOSS: "Pregnancy loss / infant bereavement",
  ELDERLY_LOSS: "Elderly loss",
  SPIRITUAL: "Spiritual / faith-based grief support",
  FAMILY_SYSTEMS: "Family systems",
  GROUP_FACILITATION: "Group grief facilitation",
  PASTORAL_CARE: "General pastoral care",
};

async function verifyCounsellor(formData: FormData) {
  "use server";
  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user || user.role !== "SUPER_ADMIN") redirect("/dashboard");

  const counsellorId = (formData.get("counsellorId") as string) || "";
  if (!counsellorId) return;

  await prisma.ilmCounsellor.update({
    where: { id: counsellorId },
    data: { verifiedAt: new Date() },
  });

  revalidatePath("/dashboard/admin/counsellors");
}

export default async function AdminCounsellorsPage() {
  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user || user.role !== "SUPER_ADMIN") redirect("/dashboard");

  const counsellors = await prisma.ilmCounsellor.findMany({
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { griefRequestsMatched: true } },
    },
    orderBy: [{ verifiedAt: { sort: "asc", nulls: "first" } }, { createdAt: "desc" }],
  });

  const unverified = counsellors.filter((c) => !c.verifiedAt);
  const verified = counsellors.filter((c) => c.verifiedAt);

  return (
    <section className="w-full">
      <h1 className="dash-page-title">Counsellors</h1>
      <p className="dash-page-lead">Manage counsellor and minister registrations.</p>

      {/* Unverified */}
      <h2 className="mt-8 text-lg font-semibold text-earth-900">
        Pending verification ({unverified.length})
      </h2>
      {unverified.length === 0 ? (
        <p className="dash-card-pad mt-3 text-sm text-earth-500">All counsellors are verified.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {unverified.map((c) => (
            <div key={c.id} className="dash-card-pad flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-earth-900">{c.user.name || "Unknown"}</p>
                <p className="text-sm text-earth-500">{c.user.email}</p>
                {c.bio && <p className="mt-1 text-sm text-earth-600 line-clamp-2">{c.bio}</p>}
                {Array.isArray(c.specialisations) && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(c.specialisations as string[]).map((s) => (
                      <span key={s} className="rounded bg-earth-100 px-1.5 py-0.5 text-xs text-earth-600">
                        {SPECIALISATION_LABELS[s] || s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <form action={verifyCounsellor}>
                <input type="hidden" name="counsellorId" value={c.id} />
                <button
                  type="submit"
                  className="rounded-lg bg-calm-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-calm-600"
                >
                  Verify
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      {/* Verified */}
      <h2 className="mt-10 text-lg font-semibold text-earth-900">
        Verified ({verified.length})
      </h2>
      {verified.length === 0 ? (
        <p className="dash-card-pad mt-3 text-sm text-earth-500">No verified counsellors yet.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {verified.map((c) => (
            <div key={c.id} className="dash-card-pad flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-earth-900">{c.user.name || "Unknown"}</p>
                <p className="text-sm text-earth-500">{c.user.email}</p>
                <p className="text-xs text-earth-400">
                  Verified {new Date(c.verifiedAt!).toLocaleDateString()} · {c._count.griefRequestsMatched} matched
                </p>
                {Array.isArray(c.specialisations) && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {(c.specialisations as string[]).slice(0, 3).map((s) => (
                      <span key={s} className="rounded bg-earth-100 px-1.5 py-0.5 text-xs text-earth-600">
                        {SPECIALISATION_LABELS[s] || s}
                      </span>
                    ))}
                    {(c.specialisations as string[]).length > 3 && (
                      <span className="text-xs text-earth-400">+{c.specialisations.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
