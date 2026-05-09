import { IlmEventKind, IlmMediaKind, IlmSubmissionStatus } from "@prisma/client";
import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { GuestbookPanel } from "@/components/memorial/guestbook-panel";
import { MemorialCtaRow } from "@/components/memorial/memorial-cta-row";
import { MemorialEventInfo } from "@/components/memorial/memorial-event-info";
import { MemorialHero } from "@/components/memorial/memorial-hero";
import { MemorialOrderOfService } from "@/components/memorial/memorial-order-of-service";
import { MemorialPhotoGallery } from "@/components/memorial/memorial-photo-gallery";
import { MemorialSectionNav } from "@/components/memorial/memorial-section-nav";
import { MemorialSpecialRequest } from "@/components/memorial/memorial-special-request";
import { MemorialVideos } from "@/components/memorial/memorial-videos";
import { PrayerPanel } from "@/components/memorial/prayer-panel";
import { getIlmSession } from "@/lib/auth";
import {
  ILM_MEDIA_TITLE_BANNER,
  ILM_MEDIA_TITLE_PROFILE,
  isGalleryPhotoTitle,
} from "@/lib/ilm-media-slots";
import { getMemorialAbsoluteUrl } from "@/lib/ilm-public-url";
import { resolveTheme } from "@/lib/ilm-theme";
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
    robots:
      memorial.hideFromSearchEngines || memorial.privacyLevel !== "PUBLIC"
        ? { index: false, follow: false }
        : undefined,
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
      themePreset: true,
      primaryColor: true,
      accentColor: true,
    },
  });

  if (!memorial) notFound();

  const session = await getIlmSession();
  const userId =
    session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;
  const isKeeper = userId === memorial.pageKeeperId;
  const isPublic = memorial.privacyLevel === "PUBLIC";
  const canView = isPublic || isKeeper;

  const tab = oneParam(searchParams.tab) ?? "memorial";
  const isFuneralTab = tab === "funeral-service";

  const gbSent = oneParam(searchParams.guestbook);
  const prSent = oneParam(searchParams.prayer);

  const [
    guestbookApproved,
    prayersApproved,
    pendingGuestbook,
    pendingPrayers,
    photoRows,
    videoRows,
    events,
    pamphlets,
  ] = await Promise.all([
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
    prisma.ilmMedia.findMany({
      where: {
        memorialId: memorial.id,
        kind: IlmMediaKind.VIDEO,
        status: IlmSubmissionStatus.APPROVED,
      },
      orderBy: { createdAt: "asc" },
      select: { id: true, storageUrl: true, title: true },
    }),
    prisma.ilmEvent.findMany({
      where: { memorialId: memorial.id },
      orderBy: { startsAt: "asc" },
      select: { id: true, kind: true, title: true, startsAt: true, venue: true, notes: true, streamUrl: true },
    }),
    prisma.ilmPamphlet.findFirst({
      where: { memorialId: memorial.id },
      select: { id: true, pdfUrl: true },
    }),
  ]);

  const profileUrl =
    photoRows.find((p) => p.title === ILM_MEDIA_TITLE_PROFILE)?.storageUrl ?? null;
  const bannerUrl =
    photoRows.find((p) => p.title === ILM_MEDIA_TITLE_BANNER)?.storageUrl ?? null;
  const galleryPhotos = photoRows.filter((p) => isGalleryPhotoTitle(p.title));

  const theme = resolveTheme(memorial.themePreset, memorial.primaryColor, memorial.accentColor);
  const primaryColor = theme.primary;
  const accentColor = theme.accent;

  const headerList = headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "https";
  const inferredBase = host ? `${proto}://${host}` : "";

  let shareUrl = getMemorialAbsoluteUrl(memorial.slug);
  if (!shareUrl && inferredBase) {
    shareUrl = `${inferredBase}/memorial/${memorial.slug}`;
  }

  // Build video list: video media + event stream URLs
  const videos = [
    ...events
      .filter((e) => e.streamUrl)
      .map((e) => ({ id: `event-${e.id}`, url: e.streamUrl!, title: e.title })),
    ...videoRows.map((v) => ({ id: v.id, url: v.storageUrl, title: v.title })),
  ];

  // Special request: first OTHER event with streamUrl
  const specialEvent = events.find((e) => e.kind === IlmEventKind.OTHER && e.streamUrl);
  const specialRequest = specialEvent
    ? {
        id: specialEvent.id,
        tagline: specialEvent.notes,
        video: specialEvent.streamUrl
          ? { id: specialEvent.id, url: specialEvent.streamUrl, title: specialEvent.title }
          : null,
      }
    : null;

  // Service location events (FUNERAL + VISITATION)
  const serviceEvents = events.filter(
    (e) => e.kind === IlmEventKind.FUNERAL || e.kind === IlmEventKind.VISITATION,
  );

  // Videos for the funeral tab: exclude the special request event
  const funeralVideos = videos.filter((v) => !specialEvent || v.id !== `event-${specialEvent.id}`);

  if (!canView) {
    return (
      <main className="ilm-container py-16">
        <h1 className="text-2xl font-semibold tracking-tight text-earth-900">
          This page is not public
        </h1>
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

  const showCommunityForms = isPublic;
  const kindLabel =
    memorial.kind === "LIVING_LEGACY" ? "Living Legacy" : "In Loving Memory of";

  return (
    <main className="pb-20">
      {isKeeper && !isPublic ? (
        <div className="ilm-container pt-10">
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            You are viewing a non-public page as the page keeper.
          </p>
        </div>
      ) : null}

      {/* Hero */}
      <section className="border-b border-earth-200/80 bg-white pt-10">
        <div className="ilm-container pb-6">
          <MemorialHero
            displayName={memorial.displayName}
            kindLabel={kindLabel}
            bannerUrl={bannerUrl}
            profileUrl={profileUrl}
            primaryColor={primaryColor}
            birthDate={memorial.birthDate}
            deathDate={memorial.deathDate}
          />

          {isKeeper ? (
            <div className="flex flex-wrap gap-4 border-t border-earth-200 pt-5 text-sm">
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
                Photos &amp; media
              </Link>
              <Link
                className="font-medium underline-offset-4 hover:underline"
                style={{ color: primaryColor }}
                href={`/dashboard/memorials/${memorial.id}/community`}
              >
                Moderate guest book &amp; prayer
                {(pendingGuestbook > 0 || pendingPrayers > 0) && (
                  <span
                    className="ml-1.5 rounded-full px-2 py-0.5 text-xs text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {pendingGuestbook + pendingPrayers}
                  </span>
                )}
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      {/* Tab nav */}
      <MemorialSectionNav slug={memorial.slug} activeTab={tab} primaryColor={primaryColor} />

      {/* Flash messages */}
      {gbSent === "sent" ? (
        <div className="ilm-container mt-6">
          <p
            className="rounded-lg border px-4 py-3 text-sm text-earth-800"
            style={{ borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}10` }}
            role="status"
          >
            Thank you — your message was received and will appear after the page keeper approves it.
          </p>
        </div>
      ) : null}
      {gbSent === "invalid" ? (
        <div className="ilm-container mt-6">
          <p className="text-sm text-red-800" role="alert">
            Please check your name and message, then try again.
          </p>
        </div>
      ) : null}
      {prSent === "sent" ? (
        <div className="ilm-container mt-6">
          <p
            className="rounded-lg border px-4 py-3 text-sm text-earth-800"
            style={{ borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}10` }}
            role="status"
          >
            Thank you — your prayer was received and will appear after moderation.
          </p>
        </div>
      ) : null}
      {prSent === "invalid" ? (
        <div className="ilm-container mt-6">
          <p className="text-sm text-red-800" role="alert">
            Please check your prayer and name, then try again.
          </p>
        </div>
      ) : null}

      {/* ── Memorial tab ── */}
      {!isFuneralTab ? (
        <>
          <article id="story" className="ilm-container mt-10">
            <div className="rounded-2xl border border-earth-200 bg-white/80 px-6 py-6 shadow-sm">
              <p className="whitespace-pre-wrap text-base leading-relaxed text-earth-800 sm:text-lg">
                {memorial.biography?.trim() ? memorial.biography : "—"}
              </p>
            </div>
          </article>

          {specialRequest ? (
            <div className="ilm-container">
              <MemorialSpecialRequest
                request={specialRequest}
                displayName={memorial.displayName}
                primaryColor={primaryColor}
              />
            </div>
          ) : null}

          <section id="gallery" className="ilm-container mt-12">
            <MemorialPhotoGallery photos={galleryPhotos} />
          </section>

          <section id="prayer" className="ilm-container mt-12">
            <PrayerPanel
              slug={memorial.slug}
              showForm={showCommunityForms}
              prayers={prayersApproved}
              primaryColor={primaryColor}
              accentColor={accentColor}
            />
          </section>
        </>
      ) : null}

      {/* ── Funeral Service tab ── */}
      {isFuneralTab ? (
        <>
          <MemorialOrderOfService pdfUrl={pamphlets?.pdfUrl} />

          {funeralVideos.length > 0 ? (
            <MemorialVideos videos={funeralVideos} />
          ) : null}

          {serviceEvents.length > 0 ? (
            <MemorialEventInfo events={serviceEvents} />
          ) : null}

          <section id="guestbook" className="ilm-container mt-12">
            <GuestbookPanel
              slug={memorial.slug}
              showForm={showCommunityForms}
              entries={guestbookApproved}
              primaryColor={primaryColor}
            />
          </section>
        </>
      ) : null}

      {/* Share precious moments CTA (both tabs) */}
      <div className="ilm-container mt-12">
        <MemorialCtaRow
          shareUrl={shareUrl}
          showContribute={showCommunityForms}
          primaryColor={primaryColor}
          accentColor={accentColor}
        />
      </div>

      {!isKeeper && isPublic ? (
        <div className="ilm-container">
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
