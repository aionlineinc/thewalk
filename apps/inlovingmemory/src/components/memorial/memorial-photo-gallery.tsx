"use client";

import { useState } from "react";
import { galleryCaption } from "@/lib/ilm-media-slots";
import { MemorialLightbox, type LightboxItem } from "@/components/memorial/memorial-lightbox";

type Photo = {
  id: string;
  storageUrl: string;
  title: string | null;
  authorGuestName?: string | null;
  createdAt?: string | Date;
};

export function MemorialPhotoGallery({
  photos,
}: {
  photos: Photo[];
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  const lightboxItems: LightboxItem[] = photos.map((p) => ({
    id: p.id,
    storageUrl: p.storageUrl,
    kind: "PHOTO",
    authorGuestName: p.authorGuestName ?? null,
    title: p.title,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : (p.createdAt ?? new Date().toISOString()),
  }));

  return (
    <>
      <section id="photos" className="border-t border-earth-200 pt-12" aria-labelledby="photos-heading">
        <h2 id="photos-heading" className="text-xl font-semibold tracking-tight text-earth-900">
          Photos
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((p, i) => {
            const cap = galleryCaption(p.title);
            return (
              <figure key={p.id} className="overflow-hidden rounded-xl border border-earth-100 bg-earth-50/50 shadow-sm">
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className="block w-full cursor-pointer text-left"
                >
                  <img
                    src={p.storageUrl}
                    alt={cap || "Memorial photo"}
                    width={600}
                    height={600}
                    className="aspect-square w-full object-cover transition hover:opacity-90"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
                {cap ? (
                  <figcaption className="px-2 py-2 text-center text-xs text-earth-600">{cap}</figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>
      </section>

      {lightboxIndex !== null ? (
        <MemorialLightbox
          items={lightboxItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </>
  );
}
