import { getIlmSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Vendor · inLovingMemory" };

export default async function VendorOverviewPage() {
  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : "";

  const provider = await prisma.ilmServiceProvider.findUnique({
    where: { userId },
    select: {
      id: true, name: true, slug: true,
      _count: { select: { orders: true } },
      orders: { orderBy: { createdAt: "desc" }, take: 5,
        select: { id: true, customerName: true, description: true, amount: true, status: true, createdAt: true },
      },
    },
  });

  if (!provider) {
    return (
      <section className="w-full">
        <h1 className="dash-page-title">Vendor dashboard</h1>
        <p className="dash-page-lead">No service provider listing is linked to your account yet. Contact an administrator to set up your vendor profile.</p>
      </section>
    );
  }

  return (
    <section className="w-full">
      <h1 className="dash-page-title">{provider.name}</h1>
      <p className="dash-page-lead">Vendor dashboard — manage your listing and orders.</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="dash-card-pad">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-earth-400">Total orders</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-earth-900">{provider._count.orders}</p>
        </div>
        <div className="dash-card-pad">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-earth-400">Public profile</p>
          <p className="mt-2 text-lg font-semibold text-earth-900">/services/{provider.slug}</p>
          <a href={`/services/${provider.slug}`} className="dash-link mt-2 inline-block text-sm">View profile →</a>
        </div>
      </div>

      <div className="dash-card mt-6 overflow-hidden">
        <div className="border-b border-earth-100 bg-earth-50/50 px-6 py-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Recent orders</p>
        </div>
        {provider.orders.length === 0 ? (
          <p className="px-6 py-8 text-sm text-earth-500">No orders yet.</p>
        ) : (
          <ul className="divide-y divide-earth-100">
            {provider.orders.map((o) => (
              <li key={o.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="font-medium text-earth-900">{o.customerName}</p>
                  <p className="text-sm text-earth-500">{o.description || "No description"}{o.amount ? ` · $${o.amount}` : null}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${
                  o.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                  o.status === "CONFIRMED" ? "bg-calm-100 text-calm-700" :
                  o.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                  "bg-earth-100 text-earth-600"
                }`}>{o.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
