/**
 * Default section renderers.
 *
 * These are minimal fallbacks. Production page routes should provide
 * `overrides` to `PageRenderer` so the site's existing visual components
 * are used instead — see `PageRenderer.tsx` for the contract.
 *
 * Everything here is framework-agnostic enough that, if rendered, it stays
 * accessible and on-brand without dictating layout to the real page design.
 */
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { cmsAssetPresets, type Section } from "@/lib/cms";

export { DefaultMinistryTabs } from "./DefaultMinistryTabs";

type SectionProps<K extends Section["__collection"]> = {
  section: Extract<Section, { __collection: K }>;
  index: number;
};

/* ─── shared chrome ─────────────────────────────────────────────────────── */

function SectionFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`w-full px-4 py-10 md:px-8 md:py-14 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

function Eyebrow({ text }: { text?: string | null }) {
  if (!text) return null;
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-foreground-muted,#6B7280)]">
      {text}
    </p>
  );
}

function CtaRow({ items }: { items: Array<{ label?: string | null; url?: string | null; variant?: "primary" | "secondary" }> }) {
  const valid = items.filter((i) => i.label && i.url);
  if (valid.length === 0) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {valid.map((c, i) => (
        <Link
          key={`${c.label}-${i}`}
          href={c.url as string}
          className={
            c.variant === "secondary"
              ? "inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black/5"
              : "inline-flex items-center justify-center rounded-full bg-[#AA0303] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#8A0202]"
          }
        >
          {c.label}
        </Link>
      ))}
    </div>
  );
}

/* ─── section renderers ─────────────────────────────────────────────────── */

export function DefaultHero({ section, index }: SectionProps<"section_hero">) {
  const src = cmsAssetPresets.heroFull(section.image);
  const priority = index === 0;
  return (
    <section className="relative w-full overflow-hidden bg-black text-white">
      {src ? (
        <div className="absolute inset-0">
          <Image
            src={src}
            alt={section.image_alt}
            fill
            priority={priority}
            sizes="100vw"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
        </div>
      ) : null}
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-24 md:px-8 md:py-32">
        <Eyebrow text={section.eyebrow} />
        <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
          {section.headline}
        </h1>
        {section.subheadline ? (
          <p className="max-w-2xl text-lg text-white/80">{section.subheadline}</p>
        ) : null}
        <CtaRow
          items={[
            { label: section.cta_primary_label, url: section.cta_primary_url, variant: "primary" },
            { label: section.cta_secondary_label, url: section.cta_secondary_url, variant: "secondary" },
          ]}
        />
      </div>
    </section>
  );
}

export function DefaultRichText({ section }: SectionProps<"section_rich_text">) {
  return (
    <SectionFrame className={section.alignment === "center" ? "text-center" : ""}>
      <Eyebrow text={section.eyebrow} />
      {section.headline ? (
        <h2 className="mt-2 text-3xl font-semibold text-black md:text-4xl">{section.headline}</h2>
      ) : null}
      <div
        className="prose prose-neutral mt-4 max-w-3xl"
        dangerouslySetInnerHTML={{ __html: section.body }}
      />
    </SectionFrame>
  );
}

export function DefaultFeatureCards({ section }: SectionProps<"section_feature_cards">) {
  const cols = section.columns ?? "3";
  const gridClass =
    cols === "2"
      ? "md:grid-cols-2"
      : cols === "4"
        ? "md:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-3";
  return (
    <SectionFrame>
      <Eyebrow text={section.eyebrow} />
      {section.headline ? (
        <h2 className="mt-2 text-3xl font-semibold text-black md:text-4xl">{section.headline}</h2>
      ) : null}
      {section.intro ? <p className="mt-3 max-w-2xl text-base text-black/70">{section.intro}</p> : null}
      <div className={`mt-8 grid grid-cols-1 gap-6 ${gridClass}`}>
        {section.items.map((card) => {
          const icon = cmsAssetPresets.thumb(card.icon);
          const inner = (
            <div className="flex h-full flex-col gap-3 rounded-2xl border border-black/[0.06] bg-white p-6 transition-shadow hover:shadow-lg">
              {icon ? (
                <Image
                  src={icon}
                  alt={card.icon_alt ?? ""}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              ) : null}
              <h3 className="text-lg font-semibold text-black">{card.title}</h3>
              {card.body ? <p className="text-sm text-black/70">{card.body}</p> : null}
            </div>
          );
          return card.url ? (
            <Link key={card.id} href={card.url} className="block h-full">
              {inner}
            </Link>
          ) : (
            <div key={card.id} className="h-full">
              {inner}
            </div>
          );
        })}
      </div>
    </SectionFrame>
  );
}

export function DefaultImageSplit({ section }: SectionProps<"section_image_split">) {
  const src = cmsAssetPresets.heroHalf(section.image);
  const imgRight = (section.image_side ?? "right") === "right";
  return (
    <SectionFrame>
      <div
        className={`grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center ${imgRight ? "" : "md:[&>*:first-child]:order-2"}`}
      >
        <div>
          <Eyebrow text={section.eyebrow} />
          <h2 className="mt-2 text-3xl font-semibold text-black md:text-4xl">{section.headline}</h2>
          {section.body ? (
            <div
              className="prose prose-neutral mt-4"
              dangerouslySetInnerHTML={{ __html: section.body }}
            />
          ) : null}
          <CtaRow items={[{ label: section.cta_label, url: section.cta_url, variant: "primary" }]} />
        </div>
        {src ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
            <Image
              src={src}
              alt={section.image_alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </SectionFrame>
  );
}

export function DefaultStats({ section }: SectionProps<"section_stats">) {
  const items = section.items ?? [];
  if (items.length === 0) return null;
  return (
    <SectionFrame>
      <Eyebrow text={section.eyebrow} />
      {section.headline ? (
        <h2 className="mt-2 text-3xl font-semibold text-black md:text-4xl">{section.headline}</h2>
      ) : null}
      <div
        className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {items.map((item, i) => (
          <div key={i} className="rounded-2xl border border-black/[0.06] bg-white p-6">
            <div className="text-3xl font-semibold text-[#AA0303]">{item.value}</div>
            <div className="mt-1 text-sm text-black/70">{item.label}</div>
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}

export function DefaultCtaBanner({ section }: SectionProps<"section_cta_banner">) {
  const bg = cmsAssetPresets.heroFull(section.background_image);
  const variant = section.variant ?? "brand";
  const toneClass =
    variant === "light"
      ? "bg-white text-black"
      : variant === "dark"
        ? "bg-black text-white"
        : "bg-[#AA0303] text-white";
  return (
    <section className={`relative overflow-hidden ${toneClass}`}>
      {bg ? (
        <div className="absolute inset-0">
          <Image src={bg} alt={section.background_alt ?? ""} fill sizes="100vw" className="object-cover opacity-30" />
        </div>
      ) : null}
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-start gap-4 px-4 py-14 md:px-8 md:py-16">
        <Eyebrow text={section.eyebrow} />
        <h2 className="text-3xl font-semibold md:text-4xl">{section.headline}</h2>
        {section.body ? <p className="max-w-2xl opacity-90">{section.body}</p> : null}
        <Link
          href={section.cta_url}
          className="mt-2 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
        >
          {section.cta_label}
        </Link>
      </div>
    </section>
  );
}

export function DefaultTimeline({ section }: SectionProps<"section_timeline">) {
  if (section.items.length === 0) return null;
  return (
    <SectionFrame>
      <Eyebrow text={section.eyebrow} />
      {section.headline ? (
        <h2 className="mt-2 text-3xl font-semibold text-black md:text-4xl">{section.headline}</h2>
      ) : null}
      {section.intro ? <p className="mt-3 max-w-2xl text-base text-black/70">{section.intro}</p> : null}
      <ol className="mt-8 space-y-8 border-l-2 border-black/10 pl-6">
        {section.items.map((item) => (
          <li key={item.id} className="relative">
            <span className="absolute -left-[calc(0.375rem+2px)] top-1.5 h-3 w-3 rounded-full bg-[#AA0303]" />
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">{item.date_label}</div>
            <h3 className="mt-1 text-xl font-semibold text-black">{item.title}</h3>
            {item.body ? (
              <div
                className="prose prose-neutral prose-sm mt-2"
                dangerouslySetInnerHTML={{ __html: item.body }}
              />
            ) : null}
          </li>
        ))}
      </ol>
    </SectionFrame>
  );
}

export function DefaultFaq({ section }: SectionProps<"section_faq">) {
  const items = section.items ?? [];
  if (items.length === 0) return null;
  return (
    <SectionFrame>
      <Eyebrow text={section.eyebrow} />
      {section.headline ? (
        <h2 className="mt-2 text-3xl font-semibold text-black md:text-4xl">{section.headline}</h2>
      ) : null}
      {section.intro ? <p className="mt-3 max-w-2xl text-base text-black/70">{section.intro}</p> : null}
      <dl className="mt-8 space-y-4">
        {items.map((item, i) => (
          <details key={i} className="group rounded-2xl border border-black/[0.06] bg-white p-5">
            <summary className="cursor-pointer list-none text-base font-semibold text-black">
              {item.question}
            </summary>
            <div
              className="prose prose-neutral prose-sm mt-3"
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          </details>
        ))}
      </dl>
    </SectionFrame>
  );
}

export function DefaultTestimonials({ section }: SectionProps<"section_testimonials">) {
  if (section.items.length === 0) return null;
  return (
    <SectionFrame>
      <Eyebrow text={section.eyebrow} />
      {section.headline ? (
        <h2 className="mt-2 text-3xl font-semibold text-black md:text-4xl">{section.headline}</h2>
      ) : null}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {section.items.map((t) => {
          const src = cmsAssetPresets.thumb(t.image);
          return (
            <figure key={t.id} className="flex flex-col gap-4 rounded-2xl border border-black/[0.06] bg-white p-6">
              <blockquote className="text-base text-black/80">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                {src ? (
                  <Image src={src} alt={t.image_alt ?? t.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                ) : null}
                <div>
                  <div className="text-sm font-semibold text-black">{t.name}</div>
                  {t.role ? <div className="text-xs text-black/60">{t.role}</div> : null}
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </SectionFrame>
  );
}

export function DefaultGallery({ section }: SectionProps<"section_gallery">) {
  if (section.items.length === 0) return null;
  const cols =
    section.layout === "grid-2"
      ? "md:grid-cols-2"
      : section.layout === "grid-4"
        ? "md:grid-cols-3 lg:grid-cols-4"
        : "md:grid-cols-3";
  return (
    <SectionFrame>
      <Eyebrow text={section.eyebrow} />
      {section.headline ? (
        <h2 className="mt-2 text-3xl font-semibold text-black md:text-4xl">{section.headline}</h2>
      ) : null}
      <div className={`mt-8 grid grid-cols-1 gap-4 ${cols}`}>
        {section.items.map((item) => {
          const src = cmsAssetPresets.card(item.image);
          if (!src) return null;
          return (
            <figure key={item.id} className="flex flex-col gap-2">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <Image src={src} alt={item.image_alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              {item.caption ? <figcaption className="text-xs text-black/60">{item.caption}</figcaption> : null}
            </figure>
          );
        })}
      </div>
    </SectionFrame>
  );
}

export function DefaultLogoStrip({ section }: SectionProps<"section_logo_strip">) {
  if (section.items.length === 0) return null;
  return (
    <SectionFrame className="bg-black/[0.02]">
      <Eyebrow text={section.eyebrow} />
      {section.headline ? (
        <h2 className="mt-2 text-xl font-semibold text-black md:text-2xl">{section.headline}</h2>
      ) : null}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-8 opacity-80">
        {section.items.map((l) => {
          const src = cmsAssetPresets.logo(l.logo);
          if (!src) return null;
          const img = (
            <Image src={src} alt={l.alt} width={140} height={40} className="h-10 w-auto object-contain" />
          );
          return l.url ? (
            <Link key={l.id} href={l.url} className="block">
              {img}
            </Link>
          ) : (
            <span key={l.id} className="block">
              {img}
            </span>
          );
        })}
      </div>
    </SectionFrame>
  );
}
