import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getIlmSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Orders · Vendor · inLovingMemory" };

async function updateOrderStatus(formData: FormData) {
  "use server";
  const orderId = (formData.get("orderId") as string)?.trim();
  const status = (formData.get("status") as string)?.trim();
  if (!orderId || !status) return;
  await prisma.ilmServiceOrder.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/dashboard/vendor/orders");
  redirect("/dashboard/vendor/orders");
}

export default async function VendorOrdersPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : "";

  const provider = await prisma.ilmServiceProvider.findUnique({ where: { userId }, select: { id: true } });
  if (!provider) redirect("/dashboard/vendor");

  const filter = (typeof searchParams.status === "string" ? searchParams.status : "") || "";

  const orders = await prisma.ilmServiceOrder.findMany({
    where: { providerId: provider.id, ...(filter ? { status: filter } : {}) },
    orderBy: { createdAt: "desc" },
    select: { id: true, customerName: true, customerEmail: true, customerPhone: true, description: true, amount: true, status: true, createdAt: true },
    take: 50,
  });

  const statuses = ["PENDING", "CONFIRMED", "PAID", "COMPLETED", "CANCELLED"];

  return (
    <section className="w-full">
      <h1 className="dash-page-title">Orders</h1>
      <p className="dash-page-lead">Manage customer orders and update status.</p>

      <div className="mt-6 flex gap-2">
        <a href="/dashboard/vendor/orders" className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${!filter ? "bg-calm-500 text-white" : "bg-white text-earth-600 hover:bg-earth-50"}`}>All</a>
        {statuses.map((s) => (
          <a key={s} href={`/dashboard/vendor/orders?status=${s}`} className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${filter === s ? "bg-calm-500 text-white" : "bg-white text-earth-600 hover:bg-earth-50"}`}>{s.charAt(0) + s.slice(1).toLowerCase()}</a>
        ))}
      </div>

      <div className="dash-card mt-6 overflow-hidden">
        <div className="border-b border-earth-100 bg-earth-50/50 px-6 py-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">{orders.length} orders</p>
        </div>
        {orders.length === 0 ? (
          <p className="px-6 py-8 text-sm text-earth-500">No orders.</p>
        ) : (
          <ul className="divide-y divide-earth-100">
            {orders.map((o) => (
              <li key={o.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-earth-900">{o.customerName}</p>
                    <p className="text-sm text-earth-500">{o.customerEmail}{o.customerPhone ? ` · ${o.customerPhone}` : null}</p>
                    {o.description ? <p className="mt-1 text-sm text-earth-700">{o.description}</p> : null}
                    <p className="mt-1 text-xs text-earth-500">
                      {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(o.createdAt)}
                      {o.amount ? ` · $${o.amount}` : null}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <form action={updateOrderStatus} className="flex items-center gap-2">
                      <input type="hidden" name="orderId" value={o.id} />
                      <select name="status" defaultValue={o.status} className="rounded-lg border border-earth-200 bg-white px-2 py-1.5 text-xs text-earth-900">
                        {statuses.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
                      </select>
                      <button type="submit" className="rounded-lg bg-earth-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-earth-900">Update</button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
