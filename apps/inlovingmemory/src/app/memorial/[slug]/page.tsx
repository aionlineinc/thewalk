import Link from "next/link";
import { notFound } from "next/navigation";
import { getIlmSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatLongDate(d: Date | null) {
  if (!d) return null;
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric" }).format(d);
}

export default async function MemorialPage({ params }: { params: { slug: string } }) {
  const memorial = await prisma.ilmMemorial.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      displayName: true,
      kind: true,
      biography: true,
      birthDate: true,
      deathDate: true,
      privacyLevel: true,
      pageKeeperId: true,
    },
  });

  if (!memorial) notFound();

  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;
  const isKeeper = userId === memorial.pageKeeperId;
  const isPublic = memorial.privacyLevel === "PUBLIC";
  const canView = isPublic || isKeeper;

  if (!canView) {
    return (
      <main className="mx-auto max-w-content px-6 py-16 sm:px-8">
        <h1 className="text-2xl font-semibold tracking-tight text-earth-900">This page is not public</h1>
        <p className="mt-4 max-w-xl text-earth-700">
          {memorial.privacyLevel === "PASSWORD"
            ? "This memorial is password protected."
            : memorial.privacyLevel === "FAMILY_ONLY"
              ? "This memorial is visible to family only."
              : "This memorial is available to invited guests only."}
        </p>
        <p className="mt-6 text-sm text-earth-600">
          Are you the page keeper?{" "}
          <Link className="font-medium text-earth-900 underline underline-offset-4" href="/sign-in">
            Sign in
          </Link>{" "}
          to view or edit.
        </p>
      </main>
    );
  }

  const birth = formatLongDate(memorial.birthDate);
  const death = formatLongDate(memorial.deathDate);
  const lifeSpan =
    birth || death ? (
      <p className="mt-3 text-sm text-earth-600">
        {[birth, death].filter(Boolean).join(" — ")}
      </p>
    ) : null;

  return (
    <main className="mx-auto max-w-content px-6 py-16 sm:px-8">
      {isKeeper && !isPublic ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          You are viewing a non-public page as the page keeper.
        </p>
      ) : null}
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-earth-500">
        {memorial.kind === "LIVING_LEGACY" ? "Living legacy" : "In loving memory"}
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-earth-900">{memorial.displayName}</h1>
      {lifeSpan}
      <p className="mt-6 whitespace-pre-wrap text-earth-800">{memorial.biography ?? "—"}</p>
      {isKeeper ? (
        <p className="mt-12">
          <Link
            className="text-sm font-medium text-earth-800 underline-offset-4 hover:underline"
            href={`/dashboard/memorials/${memorial.id}/edit`}
          >
            Edit this memorial
          </Link>
        </p>
      ) : null}
    </main>
  );
}
