import Image from "next/image";

const TILES = [
  {
    src: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=600&auto=format&fit=crop",
    alt: "Sunrise over hills",
    className:
      "left-[2%] top-[6%] z-[6] h-[38%] w-[44%] rotate-[-4deg] shadow-lg md:left-[4%] md:top-[8%]",
  },
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop",
    alt: "Mountain vista",
    className:
      "right-[4%] top-0 z-[5] h-[34%] w-[40%] rotate-[5deg] shadow-md md:right-[6%]",
  },
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop",
    alt: "Community gathering",
    className:
      "left-[18%] top-[32%] z-[7] h-[36%] w-[48%] rotate-[2deg] shadow-lg md:left-[20%] md:top-[34%]",
  },
  {
    src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=600&auto=format&fit=crop",
    alt: "Open Bible",
    className:
      "right-[0%] top-[38%] z-[4] h-[32%] w-[36%] rotate-[-6deg] shadow-md md:right-[2%]",
  },
  {
    src: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=600&auto=format&fit=crop",
    alt: "Warm interior light",
    className:
      "bottom-[4%] left-[0%] z-[3] h-[34%] w-[42%] rotate-[4deg] shadow-md md:bottom-[6%]",
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop",
    alt: "Open landscape",
    className:
      "bottom-[2%] right-[8%] z-[8] h-[38%] w-[44%] rotate-[-3deg] shadow-lg md:bottom-[4%] md:right-[10%]",
  },
];

export function BlogHeroCollage() {
  return (
    <div
      className="relative mx-auto aspect-[4/3] w-full max-w-lg md:max-w-none md:aspect-auto md:h-[min(420px,52vw)] md:max-h-[440px]"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-100/80 via-white to-earth-100/40" />
      {TILES.map((tile, index) => (
        <div
          key={`${tile.src}-${index}`}
          className={`absolute overflow-hidden rounded-2xl bg-gray-200 ring-1 ring-black/[0.06] ${tile.className}`}
        >
          <Image
            src={tile.src}
            alt=""
            fill
            className="object-cover rounded-2xl"
            sizes="(max-width:768px) 45vw, 240px"
          />
        </div>
      ))}
    </div>
  );
}
