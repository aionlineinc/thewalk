"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { cmsAssetPresets, type Section } from "@/lib/cms";

export function DefaultMinistryTabs({
  section,
}: {
  section: Extract<Section, { __collection: "section_ministry_tabs" }>;
  index: number;
}) {
  const [active, setActive] = React.useState(0);
  const tabs = section.tabs;
  if (tabs.length === 0) return null;
  const current = tabs[active] ?? tabs[0];
  const src = cmsAssetPresets.heroHalf(current.image);
  return (
    <section className="w-full px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto w-full max-w-6xl">
        {section.eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-foreground-muted,#6B7280)]">
            {section.eyebrow}
          </p>
        ) : null}
        {section.headline ? (
          <h2 className="mt-2 text-3xl font-semibold text-black md:text-4xl">{section.headline}</h2>
        ) : null}
        {section.intro ? <p className="mt-3 max-w-2xl text-base text-black/70">{section.intro}</p> : null}
        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                i === active
                  ? "bg-black text-white"
                  : "border border-black/10 text-black hover:bg-black/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 md:items-center">
          {src ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
              <Image src={src} alt={current.image_alt ?? ""} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
          ) : null}
          <div>
            <h3 className="text-2xl font-semibold text-black md:text-3xl">{current.title}</h3>
            {current.body ? (
              <div
                className="prose prose-neutral mt-3"
                dangerouslySetInnerHTML={{ __html: current.body }}
              />
            ) : null}
            {current.cta_label && current.cta_url ? (
              <div className="mt-6">
                <Link
                  href={current.cta_url}
                  className="inline-flex items-center justify-center rounded-full bg-[#AA0303] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#8A0202]"
                >
                  {current.cta_label}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
