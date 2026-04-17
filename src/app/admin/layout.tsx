import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "./_components/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-[calc(100dvh-35px)] bg-admin-canvas pt-[35px]">
      <header className="border-b border-black/[0.05] bg-admin-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 md:px-8">
          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="truncate text-lg font-semibold tracking-tight text-admin-ink transition-opacity hover:opacity-80"
              data-button-link
            >
              theWalk
            </Link>
            <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-admin-muted shadow-sm ring-1 ring-black/[0.06] sm:text-[11px] sm:px-3">
              Dashboard
            </span>
          </div>
          <Link href="/" className="admin-link hidden text-sm sm:inline">
            View site
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:flex-row md:items-start md:gap-10 md:px-8 md:py-10">
        <AdminSidebar email={session?.user?.email} name={session?.user?.name} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
