"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ScriptureReferenceMark } from "@/components/scripture/ScriptureReferenceMark";
import { useScrollToMinistryOnLoad } from "@/hooks/useScrollToMinistryOnLoad";
import { cmsAssetPresets } from "@/lib/cms/assets";
import { renderProseParagraphs } from "@/lib/cms/prose";
import type { Section } from "@/lib/cms/schemas";

type MinistryTabsSection = Extract<
  Section,
  { __collection: "section_ministry_tabs" }
>;
type MinistryTab = MinistryTabsSection["tabs"][number];

interface ResolvedTab {
  raw: MinistryTab;
  key: string;
  label: string;
  imageUrl: string | null;
  imageAlt: string;
  scriptures: string[];
  contactUrl: string;
  contactLabel: string;
}

interface Props {
  section: MinistryTabsSection;
  /** Override the section's anchor (defaults to `section.section_anchor` or "ministries"). */
  anchorId?: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitCsv(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Replace `{label}` (case-insensitive, optionally url-encoded by the
 * editor as `%7Blabel%7D`) with the active tab's label, url-encoded.
 * This lets editors ship CTA URLs like
 *   `/contact?type=serve&ministry={label}`
 * without writing per-tab URLs.
 */
function resolveCtaUrl(template: string, label: string): string {
  const encoded = encodeURIComponent(label);
  return template
    .replace(/\{label\}/gi, encoded)
    .replace(/%7Blabel%7D/gi, encoded);
}

/**
 * Tabbed ministry presentation for /journey/cross-* pages. Mirrors the
 * original CrossOverMinistryTabs visual contract exactly: rounded
 * pill-tablist, dark photographic backdrop with radial overlay, and a
 * white inner card with the active tab's lede + focus list + scripture
 * panel + per-tab CTA.
 *
 * URL state (`?tab=…`) is preserved across navigation; keyboard arrows
 * cycle tabs; the section honours scroll-to-on-load when the URL hash
 * matches `anchorId`.
 */
export function PathwayMinistryTabsSection({ section, anchorId }: Props) {
  const sectionId = anchorId ?? section.section_anchor ?? "ministries";
  const tabsId = useId();
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();

  const tabs = useMemo<ResolvedTab[]>(() => {
    return (section.tabs ?? []).map((t) => {
      const label = t.label;
      const key = (t.key && t.key.trim()) || slugify(label);
      const imageUrl = t.image ? cmsAssetPresets.heroFull(t.image) : null;
      const imageAlt = t.image_alt ?? "";
      const scriptures = splitCsv(t.scriptures);
      const contactLabel = t.cta_label?.trim() || "Contact us";
      const contactUrl = t.cta_url
        ? resolveCtaUrl(t.cta_url, label)
        : `/contact?type=serve&ministry=${encodeURIComponent(label)}`;
      return {
        raw: t,
        key,
        label,
        imageUrl,
        imageAlt,
        scriptures,
        contactLabel,
        contactUrl,
      };
    });
  }, [section.tabs]);

  const tabKeys = useMemo(() => tabs.map((t) => t.key), [tabs]);
  useScrollToMinistryOnLoad(sectionId, tabKeys);

  const activeFromUrl = searchParams?.get("tab") ?? null;
  const initialKey = useMemo(() => {
    if (activeFromUrl && tabKeys.includes(activeFromUrl)) return activeFromUrl;
    return tabs[0]?.key ?? "";
  }, [activeFromUrl, tabKeys, tabs]);
  const [active, setActive] = useState<string>(initialKey);

  useEffect(() => {
    const urlTab = searchParams?.get("tab") ?? null;
    if (!urlTab || !tabKeys.includes(urlTab)) return;
    setActive(urlTab);
  }, [searchParams, tabKeys]);

  const activeTab = useMemo(() => {
    return tabs.find((t) => t.key === active) ?? tabs[0] ?? null;
  }, [active, tabs]);

  const setTab = (next: string) => {
    setActive(next);
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("tab", next);
    const qs = params.toString();
    router.replace(`${pathname}?${qs}`, { scroll: false });
    requestAnimationFrame(() => {
      if (typeof window !== "undefined" && window.location.hash) {
        window.history.replaceState(null, "", `${pathname}?${qs}`);
      }
    });
  };

  const onTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    key: string,
  ) => {
    const idx = tabs.findIndex((t) => t.key === key);
    if (idx < 0) return;
    const focusTab = (nextIdx: number) => {
      const next = tabs[(nextIdx + tabs.length) % tabs.length];
      if (!next) return;
      setTab(next.key);
      requestAnimationFrame(() => {
        document.getElementById(`${tabsId}-${next.key}-tab`)?.focus();
      });
    };
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusTab(idx + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusTab(idx - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusTab(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusTab(tabs.length - 1);
    }
  };

  if (!activeTab) return null;
  const headingId = `${sectionId}-heading`;

  return (
    <section
      id={sectionId}
      className="relative isolate w-full scroll-mt-[120px] overflow-hidden border-t border-earth-100 py-16 md:py-24"
      aria-labelledby={headingId}
    >
      {activeTab.imageUrl && (
        <Image
          key={activeTab.key}
          src={activeTab.imageUrl}
          alt={activeTab.imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
      )}
      <div className="absolute inset-0 bg-neutral-950/50" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_20%_20%,rgba(255,255,255,0.14),transparent_60%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full px-4 md:px-8 lg:max-w-6xl lg:px-0">
        <header className="mx-auto max-w-3xl text-center">
          {section.eyebrow && (
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/85">
              {section.eyebrow}
            </p>
          )}
          {section.headline && (
            <h2
              id={headingId}
              className="font-sans text-3xl font-semibold tracking-tight text-white md:text-4xl"
            >
              {section.headline}
            </h2>
          )}
          {section.intro && (
            <div className="mx-auto mt-5 max-w-2xl text-[15px] font-light leading-relaxed text-white/80 md:text-lg">
              {renderProseParagraphs(section.intro, {
                paragraphClassName:
                  "text-[15px] font-light leading-relaxed text-white/80 md:text-lg",
              })}
            </div>
          )}
        </header>

        <div className="mx-auto mt-10 w-full">
          <div className="flex w-full justify-center">
            <div
              role="tablist"
              aria-label={section.headline ?? "Ministries"}
              className="inline-flex max-w-full flex-row flex-wrap items-center justify-center gap-2 rounded-[100px] border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md sm:px-[18px]"
            >
              {tabs.map((t) => {
                const selected = t.key === active;
                return (
                  <button
                    key={t.key}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`${tabsId}-${t.key}-panel`}
                    id={`${tabsId}-${t.key}-tab`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setTab(t.key)}
                    onKeyDown={(e) => onTabKeyDown(e, t.key)}
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-[50px] px-5 py-2.5 text-sm font-medium tracking-tight transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/60 sm:px-[25px] sm:py-3 ${
                      selected
                        ? "bg-white text-earth-900 shadow-sm"
                        : "text-white/85 hover:bg-white/15"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            role="tabpanel"
            id={`${tabsId}-${activeTab.key}-panel`}
            aria-labelledby={`${tabsId}-${activeTab.key}-tab`}
            className="mt-6 w-full overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_-25px_rgba(0,0,0,0.55)]"
          >
            <div className="px-10 py-10">
              <h3 className="font-sans text-2xl font-semibold tracking-tight text-earth-900 md:text-3xl">
                {activeTab.raw.title || activeTab.label}
              </h3>
              {activeTab.raw.lede && (
                <div className="mt-4 space-y-4 text-[15px] font-light leading-relaxed text-muted-foreground md:text-base">
                  {renderProseParagraphs(activeTab.raw.lede, {
                    paragraphClassName:
                      "text-[15px] font-light leading-relaxed text-muted-foreground md:text-base",
                  })}
                </div>
              )}

              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
                <div className="rounded-2xl border border-earth-200 bg-[#faf9f7] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-earth-700">
                    Ministry focus
                  </p>
                  <ul className="mt-5 space-y-4">
                    {(activeTab.raw.focus_items ?? []).map((f, i) => (
                      <li key={`${activeTab.key}-focus-${i}`}>
                        <p className="text-base font-semibold tracking-tight text-earth-900 md:text-lg">
                          {f.title}
                        </p>
                        <p className="mt-1 text-base font-light leading-relaxed text-muted-foreground md:text-lg">
                          {f.body}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-earth-200 bg-white p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-earth-700">
                    Key scriptures
                  </p>
                  <ul className="mt-5 space-y-2">
                    {activeTab.scriptures.map((s) => (
                      <li
                        key={`${activeTab.key}-scripture-${s}`}
                        className="text-sm font-medium text-earth-900"
                      >
                        <ScriptureReferenceMark reference={s} display={s} />
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 rounded-2xl border border-red-500/15 bg-red-500/5 p-5">
                    <p className="text-sm font-light leading-relaxed text-earth-800">
                      Want to connect or serve in{" "}
                      <span className="font-medium">{activeTab.label}</span>?
                      Reach out and we&rsquo;ll help you take the next step.
                    </p>
                    <a
                      href={activeTab.contactUrl}
                      data-button-link
                      className="mt-4 inline-flex w-fit items-center justify-center rounded-full bg-red-soft px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/15 transition-colors hover:bg-red-soft-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/60"
                    >
                      {activeTab.contactLabel}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
