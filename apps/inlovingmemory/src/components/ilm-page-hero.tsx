import Image from "next/image";
import { AppPillLink } from "@/components/ui/AppPillLink";
import type { IlmMarketingLink } from "@/content/ilm-marketing.default";

type IlmPageHeroProps = {
  eyebrow: string;
  title: string;
  body: string;
  image?: string | null;
  ctas?: IlmMarketingLink[] | null;
};

/** Shared cinematic hero for ILM sub-pages (about, how-it-works, pricing, faq, resources). */
export function IlmPageHero({ eyebrow, title, body, image, ctas }: IlmPageHeroProps) {
  return (
    <section className="relative flex h-[62vh] min-h-[480px] items-end p-2 md:p-4">
      <div className="absolute inset-2 overflow-hidden rounded-[20px] md:inset-4">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#1a1008] via-[#0f0b08] to-[#0d0806]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0806] via-black/55 to-black/20" aria-hidden />
        <div className="absolute inset-0 bg-[#7c4a1e]/15 mix-blend-overlay" aria-hidden />
      </div>
      <div className="relative z-10 ilm-container pb-12 pt-28 md:pb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-white md:text-[50px] md:leading-[1.1]">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-white/70 md:text-lg">
          {body}
        </p>
        {ctas && ctas.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-4">
            {ctas.map((cta) => (
              <AppPillLink key={cta.href + cta.label} href={cta.href} variant={cta.variant || "primary"}>
                {cta.label}
              </AppPillLink>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
