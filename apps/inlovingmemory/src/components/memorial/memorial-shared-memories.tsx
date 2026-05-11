"use client";

import { useState } from "react";
import { MemorialAudioPlayer } from "@/components/memorial/memorial-audio-player";
import { MemorialLightbox, type LightboxItem } from "@/components/memorial/memorial-lightbox";

type SharedMedia = {
  id: string;
  storageUrl: string;
  kind: string;
  authorGuestName: string | null;
  title: string | null;
  createdAt: string;
};

export function MemorialSharedMemories({ media }: { media: SharedMedia[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (media.length === 0) return null;

  const photos = media.filter((m) => m.kind === "PHOTO");
  const audio = media.filter((m) => m.kind === "AUDIO");

  const lightboxItems: LightboxItem[] = [...photos, ...audio];

  return (
    <section id="shared-memories" className="ilm-container mt-12" aria-labelledby="memories-heading">
      <h2 id="memories-heading" className="text-xl font-semibold tracking-tight text-earth-900">
        Shared memories
      </h2>
      <p className="mt-2 text-sm text-earth-600">
        Photos and audio shared by visitors, approved by the page moderator.
      </p>

      {/* Photos */}
      {photos.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((p, i) => (
            <div
              key={p.id}
              className="overflow-hidden rounded-xl border border-earth-100 bg-earth-50/50 shadow-sm"
            >
              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="block w-full cursor-pointer text-left"
              >
                <img
                  src={p.storageUrl}
                  alt={p.title ?? ""}
                  className="aspect-square w-full object-cover transition hover:opacity-90"
                  loading="lazy"
                />
              </button>
              {p.title ? (
                <p className="truncate px-3 py-2 text-xs text-earth-500">{p.title}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {/* Audio */}
      {audio.length > 0 ? (
        <div className="mt-6 space-y-3">
          {audio.map((a, i) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setLightboxIndex(photos.length + i)}
              className="block w-full text-left"
            >
              <MemorialAudioPlayer src={a.storageUrl} authorName={a.authorGuestName} />
              {a.title ? (
                <p className="mt-1 ml-14 text-xs text-earth-500">{a.title}</p>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      {lightboxIndex !== null ? (
        <MemorialLightbox
          items={lightboxItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </section>
  );
}
