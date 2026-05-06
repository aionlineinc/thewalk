import { IlmMediaKind, IlmSubmissionStatus } from "@prisma/client";
import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { GuestbookPanel } from "@/components/memorial/guestbook-panel";
import { MemorialCtaRow } from "@/components/memorial/memorial-cta-row";
import { MemorialHero } from "@/components/memorial/memorial-hero";
import { MemorialPhotoGallery } from "@/components/memorial/memorial-photo-gallery";
import { MemorialSectionNav } from "@/components/memorial/memorial-section-nav";
import { PrayerPanel } from "@/components/memorial/prayer-panel";
import { MemorialShareBar } from "@/components/memorial/share-bar";
import { getIlmSession } from "@/lib/auth";
import {
  ILM_MEDIA_TITLE_BANNER,
  ILM_MEDIA_TITLE_PROFILE,
  isGalleryPhotoTitle,
} from "@/lib/ilm-media-slots";
import { getMemorialAbsoluteUrl } from "@/lib/ilm-public-url";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
};

function oneParam(v: string | string[] | undefined) {
  if (Array.isArray(v)) return v[0];
  return v;
}

function formatLongDate(d: Date | null) {
  if (!d) return null;
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric" }).format(d);
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const memorial = await prisma.ilmMemorial.findUnique({
    where: { slug: params.slug },
    select: { displayName: true, biography: true, hideFromSearchEngines: true, privacyLevel: true },
  });

  if (!memorial) {
    return { title: "Memorial · inLovingMemory" };
  }

  const desc = memorial.biography?.replace(/\s+/g, " ").trim().slice(0, 160) || undefined;
  return {
    title: `${memorial.displayName} · inLovingMemory`,
    description: desc,
    robots: memorial.hideFromSearchEngines || memorial.privacyLevel !== "PUBLIC" ? { index: false, follow: false } : undefined,
  };
}

export default async function MemorialPage({ params, searchParams }: PageProps) {
  const memorial = await prisma.ilmMemorial.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      slug: true,
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

  const gbSent = oneParam(searchParams.guestbook);
  const prSent = oneParam(searchParams.prayer);

  const [guestbookApproved, prayersApproved, pendingGuestbook, pendingPrayers, photoRows] = await Promise.all([
    prisma.ilmGuestbookEntry.findMany({
      where: { memorialId: memorial.id, status: IlmSubmissionStatus.APPROVED },
      orderBy: { createdAt: "desc" },
      select: { id: true, authorName: true, content: true, createdAt: true },
      take: 50,
    }),
    prisma.ilmPrayer.findMany({
      where: { memorialId: memorial.id, status: IlmSubmissionStatus.APPROVED },
      orderBy: { createdAt: "desc" },
      select: { id: true, authorName: true, content: true, createdAt: true },
      take: 50,
    }),
    isKeeper
      ? prisma.ilmGuestbookEntry.count({
          where: { memorialId: memorial.id, status: IlmSubmissionStatus.PENDING },
        })
      : Promise.resolve(0),
    isKeeper
      ? prisma.ilmPrayer.count({
          where: { memorialId: memorial.id, status: IlmSubmissionStatus.PENDING },
        })
      : Promise.resolve(0),
    prisma.ilmMedia.findMany({
      where: {
        memorialId: memorial.id,
        kind: IlmMediaKind.PHOTO,
        status: IlmSubmissionStatus.APPROVED,
      },
      orderBy: { createdAt: "asc" },
      select: { id: true, storageUrl: true, title: true },
    }),
  ]);

  const profileUrl = photoRows.find((p) => p.title === ILM_MEDIA_TITLE_PROFILE)?.storageUrl ?? null;
  const bannerUrl = photoRows.find((p) => p.title === ILM_MEDIA_TITLE_BANNER)?.storageUrl ?? null;
  const galleryPhotos = photoRows.filter((p) => isGalleryPhotoTitle(p.title));

  const headerList = headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "https";
  const inferredBase = host ? `${proto}://${host}` : "";

  let shareUrl = getMemorialAbsoluteUrl(memorial.slug);
  if (!shareUrl && inferredBase) {
    shareUrl = `${inferredBase}/memorial/${memorial.slug}`;
  }

  if (!canView) {
    return (
      <main className="ilm-prose py-16">
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
      <p className="mt-4 text-base text-earth-600">
        {[birth, death].filter(Boolean).join(" — ")}
      </p>
    ) : null;

  const showCommunityForms = isPublic;

  return (
    <main className="pb-20">
      {isKeeper && !isPublic ? (
        <div className="ilm-prose pt-10">
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            You are viewing a non-public page as the page keeper.
          </p>
        </div>
      ) : null}

      <section className="border-b border-earth-200/80 bg-white pt-10">
        <div className="ilm-prose pb-10">
          <MemorialHero
            displayName={memorial.displayName}
            kindLabel={memorial.kind === "LIVING_LEGACY" ? "Living legacy" : "In loving memory"}
            bannerUrl={bannerUrl}
            profileUrl={profileUrl}
          />

          <div className="border-b border-earth-200 pb-8">
            {lifeSpan}
            {isKeeper ? (
              <div className={`flex flex-wrap gap-4 text-sm ${lifeSpan ? "mt-8" : "mt-2"}`}>
                <Link
                  className="font-medium text-earth-800 underline-offset-4 hover:underline"
                  href={`/dashboard/memorials/${memorial.id}/edit`}
                >
                  Edit details
                </Link>
                <Link
                  className="font-medium text-earth-800 underline-offset-4 hover:underline"
                  href={`/dashboard/memorials/${memorial.id}/media`}
                >
                  Photos
                </Link>
                <Link
                  className="font-medium text-calm-500 underline-offset-4 hover:underline"
                  href={`/dashboard/memorials/${memorial.id}/community`}
                >
                  Moderate guest book & prayer
                  {(pendingGuestbook > 0 || pendingPrayers > 0) && (
                    <span className="ml-1.5 rounded-full bg-calm-500 px-2 py-0.5 text-xs text-white">
                      {pendingGuestbook + pendingPrayers}
                    </span>
                  )}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <MemorialCtaRow shareUrl={shareUrl} showContribute={showCommunityForms} />

      <MemorialSectionNav />

      {gbSent === "sent" ? (
        <div className="ilm-prose mt-8">
          <p className="rounded-lg border border-earth-200 bg-earth-50 px-4 py-3 text-sm text-earth-800" role="status">
            Thank you — your message was received and will appear after the page keeper approves it.
          </p>
        </div>
      ) : null}
      {gbSent === "invalid" ? (
        <div className="ilm-prose mt-8">
          <p className="text-sm text-red-800" role="alert">
            Please check your name and message, then try again.
          </p>
        </div>
      ) : null}

      {prSent === "sent" ? (
        <div className="ilm-prose mt-8">
          <p
            className="rounded-lg border border-calm-500/30 bg-calm-500/10 px-4 py-3 text-sm text-earth-800"
            role="status"
          >
            Thank you — your prayer was received and will appear after moderation.
          </p>
        </div>
      ) : null}
      {prSent === "invalid" ? (
        <div className="ilm-prose mt-8">
          <p className="text-sm text-red-800" role="alert">
            Please check your prayer and name, then try again.
          </p>
        </div>
      ) : null}

      <article id="story" className="ilm-prose mt-12">
        <h2 className="sr-only">Life story</h2>
        <div className="rounded-2xl border border-earth-200 bg-white/80 px-6 py-6 shadow-sm">
          <div className="max-w-none text-base leading-relaxed text-earth-800 sm:text-lg">
            <p className="whitespace-pre-wrap">{memorial.biography?.trim() ? memorial.biography : "—"}</p>
          </div>
        </div>
      </article>

      <section id="service" className="ilm-prose mt-12" aria-labelledby="service-heading">
        <h2 id="service-heading" className="text-xl font-semibold tracking-tight text-earth-900">
          Order of service
        </h2>
        <p className="mt-2 text-sm text-earth-600">
          Service details and program content will appear here. (Design scaffold — wiring comes next.)
        </p>
        <div className="mt-6 rounded-2xl border border-earth-200 bg-earth-50/40 px-6 py-5 shadow-sm">
          <p className="text-sm font-semibold text-earth-900">Funeral service location</p>
          <p className="mt-2 text-sm text-earth-700">Coming soon</p>
        </div>
      </section>

      <section id="gallery" className="ilm-prose mt-12">
        <MemorialPhotoGallery photos={galleryPhotos} />
      </section>

      {shareUrl ? (
        <section className="ilm-prose mt-12" aria-labelledby="share-heading">
          <h2 id="share-heading" className="text-xl font-semibold tracking-tight text-earth-900">
            Share
          </h2>
          <p className="mt-2 text-sm text-earth-600">Invite others to visit this page.</p>
          <div className="mt-4 rounded-2xl border border-earth-200 bg-white/80 px-6 py-5 shadow-sm">
            <MemorialShareBar shareUrl={shareUrl} />
          </div>
        </section>
      ) : null}

      <section id="guestbook" className="ilm-prose">
        <GuestbookPanel slug={memorial.slug} showForm={showCommunityForms} entries={guestbookApproved} />
      </section>

      <section id="prayer" className="ilm-prose">
        <PrayerPanel slug={memorial.slug} showForm={showCommunityForms} prayers={prayersApproved} />
      </section>

      {!isKeeper && isPublic ? (
        <div className="ilm-prose">
          <p className="mt-12 border-t border-earth-200 pt-8 text-center text-xs text-earth-500">
            Hosted with care on inLovingMemory ·{" "}
            <Link href="/" className="underline underline-offset-2 hover:text-earth-700">
              Learn more
            </Link>
          </p>
        </div>
      ) : null}
    </main>
  );
}
