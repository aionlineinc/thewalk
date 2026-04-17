"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  GROWTH_RESOURCE_CATEGORIES,
  GROWTH_SERVICES_TEASER,
  type ResourceCategory,
  type ResourceItem,
} from "@/lib/growth-resources-data";

function PlusIcon({ open, className }: { open: boolean; className?: string }) {
  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 text-lg text-gray-500 transition-transform duration-200 ${
        open ? "rotate-45" : ""
      } ${className ?? ""}`}
      aria-hidden
    >
      +
    </span>
  );
}

function ResourceLinks({
  downloads,
  externals,
}: {
  downloads?: ResourceItem["downloads"];
  externals?: ResourceItem["externals"];
}) {
  if (!downloads?.length && !externals?.length) return null;
  return (
    <ul className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
      {downloads?.map((d) => (
        <li key={d.href + d.label}>
          <Link
            href={d.href}
            className="inline-flex items-center gap-2 text-sm font-medium text-red-900 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
          >
            <span className="text-gray-500" aria-hidden>
              ↓
            </span>
            {d.label}
          </Link>
        </li>
      ))}
      {externals?.map((e) => {
        const isExternal = e.href.startsWith("http");
        if (isExternal || e.href.startsWith("mailto:")) {
          return (
            <li key={e.href + e.label}>
              <a
                href={e.href}
                target={e.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={e.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="inline-flex items-center gap-2 text-sm font-medium text-red-900 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
              >
                <span className="text-gray-500" aria-hidden>
                  ↗
                </span>
                {e.label}
              </a>
            </li>
          );
        }
        return (
          <li key={e.href + e.label}>
            <Link
              href={e.href}
              className="inline-flex items-center gap-2 text-sm font-medium text-red-900 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
            >
              <span className="text-gray-500" aria-hidden>
                →
              </span>
              {e.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ResourceAccordionItem({
  item,
  open,
  onToggle,
  searchActive,
}: {
  item: ResourceItem;
  open: boolean;
  onToggle: () => void;
  searchActive: boolean;
}) {
  const expanded = open || searchActive;
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <h3 className="m-0">
        {searchActive ? (
          <div className="flex w-full items-start justify-between gap-4 py-5 text-left text-base font-normal text-gray-900 md:text-[17px]">
            <span>{item.title}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-start justify-between gap-4 py-5 text-left text-base font-normal text-gray-900 transition-colors hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 md:text-[17px]"
            aria-expanded={expanded}
          >
            <span>{item.title}</span>
            <PlusIcon open={open} />
          </button>
        )}
      </h3>
      {expanded ? (
        <div className="pb-6 pl-0 pr-10 md:pr-12">
          <p className="text-[15px] leading-relaxed text-gray-600">{item.summary}</p>
          <ResourceLinks downloads={item.downloads} externals={item.externals} />
        </div>
      ) : null}
    </div>
  );
}

function CategoryBlock({
  category,
  query,
}: {
  category: ResourceCategory;
  query: string;
}) {
  const q = query.trim().toLowerCase();
  const searchActive = q.length > 0;

  const items = useMemo(() => {
    if (!q) return category.items;
    if (category.title.toLowerCase().includes(q) || (category.description ?? "").toLowerCase().includes(q)) {
      return category.items;
    }
    return category.items.filter((item) => {
      const blob = `${item.title} ${item.summary}`.toLowerCase();
      return blob.includes(q);
    });
  }, [category, q]);

  const [openId, setOpenId] = useState<string | null>(null);

  if (items.length === 0) return null;

  return (
    <section
      id={category.id}
      className="scroll-mt-[calc(2rem+88px)] border-b border-gray-100 py-16 md:scroll-mt-[calc(2rem+100px)] md:py-24"
      aria-labelledby={`category-${category.id}-title`}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] md:gap-16 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
        <div className="md:pt-1">
          <h2 id={`category-${category.id}-title`} className="text-2xl font-medium tracking-tight text-gray-900 md:text-[26px]">
            {category.title}
          </h2>
          {category.description ? (
            <p className="mt-3 text-sm leading-relaxed text-gray-500">{category.description}</p>
          ) : null}
        </div>
        <div>
          {items.map((item) => (
            <ResourceAccordionItem
              key={item.id}
              item={item}
              open={openId === item.id}
              onToggle={() => setOpenId((id) => (id === item.id ? null : item.id))}
              searchActive={searchActive}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function GrowthResourcesClient() {
  const [query, setQuery] = useState("");
  const [svcOpen, setSvcOpen] = useState<string | null>(null);

  const visibleCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROWTH_RESOURCE_CATEGORIES;
    return GROWTH_RESOURCE_CATEGORIES.filter((cat) => {
      const catMatch = `${cat.title} ${cat.description ?? ""}`.toLowerCase().includes(q);
      const itemMatch = cat.items.some((item) =>
        `${item.title} ${item.summary}`.toLowerCase().includes(q),
      );
      return catMatch || itemMatch;
    });
  }, [query]);

  const visibleServiceItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROWTH_SERVICES_TEASER.items;
    if (
      GROWTH_SERVICES_TEASER.title.toLowerCase().includes(q) ||
      (GROWTH_SERVICES_TEASER.description ?? "").toLowerCase().includes(q)
    ) {
      return GROWTH_SERVICES_TEASER.items;
    }
    return GROWTH_SERVICES_TEASER.items.filter((item) =>
      `${item.title} ${item.summary}`.toLowerCase().includes(q),
    );
  }, [query]);

  const showServicesSection =
    query.trim().length === 0 ||
    `${GROWTH_SERVICES_TEASER.title} ${GROWTH_SERVICES_TEASER.description ?? ""}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()) ||
    visibleServiceItems.length > 0;

  const navIds = [
    ...GROWTH_RESOURCE_CATEGORIES.map((c) => c.id),
    GROWTH_SERVICES_TEASER.id,
  ];

  return (
    <>
      <section
        className="border-b border-gray-100 bg-white pb-12 pt-28 md:pb-16 md:pt-36"
        aria-labelledby="growth-resources-hero-title"
      >
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Growth</p>
          <h1 id="growth-resources-hero-title" className="mt-3 text-4xl font-normal tracking-tight text-gray-900 md:text-5xl">
            Resources
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-gray-600">
            Downloads, links, and references for your walk — organized like a library, easy to search.
          </p>
          <div className="mx-auto mt-10 max-w-lg">
            <label htmlFor="growth-resources-search" className="sr-only">
              Search resources
            </label>
            <input
              id="growth-resources-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics, titles, or documents…"
              className="w-full rounded-full border border-gray-200 bg-gray-50 px-5 py-3.5 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-red-900/25 focus:bg-white focus:ring-2 focus:ring-red-900/15"
              autoComplete="off"
            />
          </div>
          <nav
            className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-x-3 gap-y-2 text-sm"
            aria-label="Jump to section"
          >
            {navIds.map((id) => {
              const label =
                GROWTH_RESOURCE_CATEGORIES.find((c) => c.id === id)?.title ??
                GROWTH_SERVICES_TEASER.title;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1.5 font-medium text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
                >
                  {label}
                </a>
              );
            })}
          </nav>
        </div>
      </section>

      <div className="bg-white">
        {visibleCategories.map((cat) => (
          <CategoryBlock key={cat.id} category={cat} query={query} />
        ))}

        {query.trim() && visibleCategories.length === 0 ? (
          <p className="mx-auto max-w-lg px-4 py-20 text-center text-gray-600">
            Nothing matched that search. Try another keyword or clear the field to see everything.
          </p>
        ) : null}

        {showServicesSection ? (
          <section
            id={GROWTH_SERVICES_TEASER.id}
            className="scroll-mt-[calc(2rem+88px)] border-b border-gray-100 py-16 md:scroll-mt-[calc(2rem+100px)] md:py-24"
            aria-labelledby="category-services-title"
          >
            <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] md:gap-16 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
              <div className="md:pt-1">
                <h2 id="category-services-title" className="text-2xl font-medium tracking-tight text-gray-900 md:text-[26px]">
                  {GROWTH_SERVICES_TEASER.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">{GROWTH_SERVICES_TEASER.description}</p>
                <Link
                  href="/growth/services"
                  className="mt-6 inline-flex text-sm font-medium text-red-900 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
                >
                  Open Services page
                </Link>
              </div>
              <div>
                {visibleServiceItems.map((item) => (
                  <ResourceAccordionItem
                    key={item.id}
                    item={item}
                    open={svcOpen === item.id}
                    onToggle={() => setSvcOpen((id) => (id === item.id ? null : item.id))}
                    searchActive={query.trim().length > 0}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </div>

      <section className="bg-white pb-24 pt-4 md:pb-32" aria-labelledby="resources-cta-heading">
        <div className="mx-auto max-w-6xl px-4">
          <div className="relative isolate h-[min(320px,50vh)] w-full overflow-hidden rounded-3xl md:h-[380px]">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />
            <Image
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 1152px"
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
              <h2 id="resources-cta-heading" className="text-2xl font-medium tracking-tight text-white md:text-3xl">
                Walk with us
              </h2>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/90">
                Learn who we are and how we serve Christ-centered community.
              </p>
              <Link
                href="/about"
                data-button-link
                className="mt-8 inline-flex rounded-full bg-red-soft px-8 py-3 text-sm font-medium text-white shadow-lg shadow-black/25 transition-colors hover:bg-red-soft-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                About theWalk
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
