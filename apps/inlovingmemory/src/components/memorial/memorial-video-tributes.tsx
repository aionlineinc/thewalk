import { toEmbedUrl } from "@/components/memorial/memorial-videos";

type VideoTribute = {
  id: string;
  storageUrl: string;
  authorGuestName: string | null;
  createdAt: Date;
};

export function MemorialVideoTributes({ tributes }: { tributes: VideoTribute[] }) {
  if (tributes.length === 0) return null;

  return (
    <section className="ilm-container mt-12" aria-labelledby="tributes-heading">
      <h2 id="tributes-heading" className="text-xl font-semibold tracking-tight text-earth-900">
        Video tributes
      </h2>
      <p className="mt-2 text-sm text-earth-600">
        Video eulogies shared by family and friends.
      </p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {tributes.map((t) => {
          const embedUrl = toEmbedUrl(t.storageUrl);
          if (!embedUrl) return null;
          return (
            <div key={t.id} className="overflow-hidden rounded-xl border border-earth-200 bg-white shadow-sm">
              <div className="relative aspect-video w-full bg-earth-900">
                <iframe
                  src={embedUrl}
                  title={t.authorGuestName ?? "Video tribute"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                />
              </div>
              <div className="px-4 py-3">
                {t.authorGuestName ? (
                  <p className="text-sm font-medium text-earth-900">{t.authorGuestName}</p>
                ) : null}
                <p className="text-xs text-earth-500">
                  {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(t.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
