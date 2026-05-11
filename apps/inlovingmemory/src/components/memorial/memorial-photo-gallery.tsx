"use client";

import { galleryCaption } from "@/lib/ilm-media-slots";

export function MemorialPhotoGallery({
  photos,
  onPhotoClick,
}: {
  photos: { id: string; storageUrl: string; title: string | null }[];
  onPhotoClick?: (index: number) => void;
}) {
  if (photos.length === 0) return null;

  return (
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
                onClick={() => onPhotoClick?.(i)}
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
  );
}
