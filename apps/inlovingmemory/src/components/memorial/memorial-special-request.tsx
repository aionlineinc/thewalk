import { type VideoItem } from "./memorial-videos";

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.includes("/embed/")) return url;
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname === "youtu.be") {
      const v = u.pathname.slice(1).split("?")[0];
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
  } catch {
    // not a valid URL
  }
  return null;
}

export type SpecialRequest = {
  id: string;
  tagline: string | null;
  video: VideoItem | null;
  ctaLabel?: string | null;
};

export function MemorialSpecialRequest({
  request,
  displayName,
  primaryColor,
}: {
  request: SpecialRequest;
  displayName: string;
  primaryColor?: string;
}) {
  const embedUrl = request.video ? toEmbedUrl(request.video.url) : null;

  return (
    <section className="ilm-prose mt-12 border-t border-earth-200 pt-10">
      <h2 className="text-xl font-semibold tracking-tight text-earth-900">Special Request</h2>

      {request.tagline ? (
        <p className="mt-3 text-sm leading-relaxed text-earth-700">{request.tagline}</p>
      ) : null}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {embedUrl ? (
          <div className="overflow-hidden rounded-2xl border border-earth-200 shadow-sm">
            <div className="relative aspect-video w-full bg-earth-900">
              <iframe
                src={embedUrl}
                title={request.video?.title ?? "Special request video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
                loading="lazy"
              />
            </div>
          </div>
        ) : null}

        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-earth-200 bg-earth-50/60 px-6 py-8 text-center shadow-sm"
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full border-2"
            style={{ borderColor: primaryColor || "#b8642a" }}
          >
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              style={{ color: primaryColor || "#b8642a" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <p className="mt-4 text-sm font-semibold text-earth-900">
            {request.ctaLabel ?? `Make a commitment in the name of ${displayName}`}
          </p>
          <button
            type="button"
            className="mt-4 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            style={{ backgroundColor: primaryColor || "#b8642a" }}
          >
            Start Now
          </button>
        </div>
      </div>
    </section>
  );
}
