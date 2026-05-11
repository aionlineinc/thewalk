import { IlmEventKind, IlmMediaKind, IlmSubmissionStatus } from "@prisma/client";
import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { GuestbookPanel } from "@/components/memorial/guestbook-panel";
import { MemorialCtaRow } from "@/components/memorial/memorial-cta-row";
import { MemorialEventInfo } from "@/components/memorial/memorial-event-info";
import { MemorialEventRsvpForm } from "@/components/memorial/memorial-event-rsvp-form";
import { MemorialFlowersDonations } from "@/components/memorial/memorial-flowers-donations";
import { MemorialHero } from "@/components/memorial/memorial-hero";
import { MemorialOrderOfService } from "@/components/memorial/memorial-order-of-service";
import { MemorialPhotoGallery } from "@/components/memorial/memorial-photo-gallery";
import { MemorialSectionNav } from "@/components/memorial/memorial-section-nav";
import { MemorialSharedMemories } from "@/components/memorial/memorial-shared-memories";
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
      bannerPreset: true,
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
    guestMedia,
    flowerDonations,
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
      select: { id: true, kind: true, title: true, startsAt: true, venue: true, address: true, mapUrl: true, officiant: true, programDetails: true, notes: true, streamUrl: true },
    }),
    prisma.ilmPamphlet.findFirst({
      where: { memorialId: memorial.id },
      select: { id: true, pdfUrl: true },
    }),
    prisma.ilmMedia.findMany({
      where: {
        memorialId: memorial.id,
        authorGuestName: { not: null },
        status: IlmSubmissionStatus.APPROVED,
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, storageUrl: true, kind: true, authorGuestName: true, createdAt: true },
      take: 50,
    }),
    prisma.ilmFlowerDonation.findMany({
      where: { memorialId: memorial.id },
      orderBy: { sortOrder: "asc" },
      select: { id: true, label: true, url: true, description: true, kind: true },
    }),
  ]);

  const profileUrl =
    photoRows.find((p) => p.title === ILM_MEDIA_TITLE_PROFILE)?.storageUrl ?? null;
  const customBannerUrl =
    photoRows.find((p) => p.title === ILM_MEDIA_TITLE_BANNER)?.storageUrl ?? null;

  let presetBannerUrl: string | null = null;
  if (memorial.bannerPreset?.startsWith("custom:")) {
    const customId = memorial.bannerPreset.slice(7);
    const customPreset = await prisma.ilmBannerPreset.findUnique({
      where: { id: customId },
      select: { storageUrl: true },
    });
    if (customPreset) presetBannerUrl = customPreset.storageUrl;
  }
  const bannerUrl = customBannerUrl || presetBannerUrl;
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
          Are you the page moderator?{" "}
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
            You are viewing a non-public page as the page moderator.
          </p>
        </div>
      ) : null}

      {/* Hero */}
      <section className="relative flex h-[62vh] min-h-[480px] items-end p-2 md:p-4">
        <div className="absolute inset-2 overflow-hidden rounded-[20px] md:inset-4">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt=""
              className="h-full w-full object-cover"
              loading="eager"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#1a1008] via-[#0f0b08] to-[#0d0806]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0806] via-black/55 to-black/20" aria-hidden />
          <div className="absolute inset-0 bg-[#7c4a1e]/15 mix-blend-overlay" aria-hidden />
        </div>
        <div className="relative z-10 ilm-container pb-12 pt-28 md:pb-16">
          <MemorialHero
            displayName={memorial.displayName}
            kindLabel={kindLabel}
            bannerUrl={bannerUrl}
            profileUrl={profileUrl}
            primaryColor={primaryColor}
            birthDate={memorial.birthDate}
            deathDate={memorial.deathDate}
            dark
          />

          {isKeeper ? (
            <div className="flex flex-wrap gap-4 border-t border-white/10 pt-5 text-sm">
              <Link
                className="font-medium text-white/70 underline-offset-4 hover:text-white hover:underline"
                href={`/dashboard/memorials/${memorial.id}/edit`}
              >
                Edit details
              </Link>
              <Link
                className="font-medium text-white/70 underline-offset-4 hover:text-white hover:underline"
                href={`/dashboard/memorials/${memorial.id}/media`}
              >
                Photos &amp; media
              </Link>
              <Link
                className="font-medium text-white/70 underline-offset-4 hover:text-white hover:underline"
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
            Thank you — your message was received and will appear after the page moderator approves it.
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

          <MemorialSharedMemories media={guestMedia} />

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

          <MemorialEventInfo events={serviceEvents} />

          <MemorialFlowersDonations items={flowerDonations} />

          {funeralVideos.length > 0 ? (
            <MemorialVideos videos={funeralVideos} />
          ) : null}

          <MemorialEventRsvpForm
            eventIds={serviceEvents.map((e) => e.id)}
            memorialSlug={memorial.slug}
          />

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
          memorialSlug={memorial.slug}
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
