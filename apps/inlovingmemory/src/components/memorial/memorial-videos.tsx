export function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    // YouTube
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.includes("/embed/")) return url;
      if (u.pathname.includes("/live/")) {
        const id = u.pathname.split("/live/")[1]?.split(/[/?]/)[0];
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname === "youtu.be") {
      const v = u.pathname.slice(1).split("?")[0];
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    // Vimeo
    if (u.hostname.includes("vimeo.com")) {
      if (u.pathname.includes("/video/")) return url; // already embed
      const id = u.pathname.slice(1).split(/[/?#]/)[0];
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    // not a valid URL
  }
  return null;
}

export type VideoItem = {
  id: string;
  url: string;
  title?: string | null;
};

export function MemorialVideos({
  videos,
  heading = "Videos",
}: {
  videos: VideoItem[];
  heading?: string;
}) {
  if (videos.length === 0) return null;

  return (
    <section className="ilm-container mt-8 space-y-6">
      <h2 className="text-xl font-semibold tracking-tight text-earth-900">{heading}</h2>
      {videos.map((v) => {
        const embedUrl = toEmbedUrl(v.url);
        if (!embedUrl) return null;
        return (
          <div key={v.id} className="overflow-hidden rounded-2xl border border-earth-200 shadow-sm">
            <div className="relative aspect-video w-full bg-earth-900">
              <iframe
                src={embedUrl}
                title={v.title ?? "Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
                loading="lazy"
              />
            </div>
            {v.title ? (
              <p className="bg-white px-4 py-2 text-sm font-medium text-earth-800">{v.title}</p>
            ) : null}
          </div>
        );
      })}
    </section>
  );
}
