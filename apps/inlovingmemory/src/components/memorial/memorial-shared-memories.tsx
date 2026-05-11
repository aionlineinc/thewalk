import { MemorialAudioPlayer } from "@/components/memorial/memorial-audio-player";

type SharedMedia = {
  id: string;
  storageUrl: string;
  kind: string;
  authorGuestName: string | null;
  createdAt: Date;
};

export function MemorialSharedMemories({ media }: { media: SharedMedia[] }) {
  if (media.length === 0) return null;

  const photos = media.filter((m) => m.kind === "PHOTO");
  const audio = media.filter((m) => m.kind === "AUDIO");

  return (
    <section id="memories" className="ilm-container mt-12" aria-labelledby="memories-heading">
      <h2 id="memories-heading" className="text-xl font-semibold tracking-tight text-earth-900">
        Shared memories
      </h2>
      <p className="mt-2 text-sm text-earth-600">
        Photos and audio shared by visitors, approved by the page moderator.
      </p>

      {/* Photos */}
      {photos.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((p) => (
            <div
              key={p.id}
              className="overflow-hidden rounded-xl border border-earth-100 bg-earth-50/50 shadow-sm"
            >
              <img
                src={p.storageUrl}
                alt=""
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
              {p.authorGuestName ? (
                <p className="truncate px-3 py-2 text-xs text-earth-500">
                  {p.authorGuestName} ·{" "}
                  {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(p.createdAt)}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {/* Audio */}
      {audio.length > 0 ? (
        <div className="mt-6 space-y-3">
          {audio.map((a) => (
            <MemorialAudioPlayer key={a.id} src={a.storageUrl} authorName={a.authorGuestName} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
