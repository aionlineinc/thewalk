import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminNav } from "./_components/AdminNav";

export default async function AdminHome() {
  const session = await getServerSession(authOptions);

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-earth-900">Admin</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Signed in as <span className="font-medium">{session?.user?.email}</span>
      </p>

      <div className="mt-6">
        <AdminNav />
      </div>

      <pre className="mt-6 overflow-auto rounded-xl border border-earth-100 bg-white p-5 text-xs">
        {JSON.stringify(session, null, 2)}
      </pre>
    </section>
  );
}

