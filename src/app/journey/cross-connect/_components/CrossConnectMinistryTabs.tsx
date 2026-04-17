"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ScriptureReferenceMark } from "@/components/scripture/ScriptureReferenceMark";
import { useScrollToMinistryOnLoad } from "@/hooks/useScrollToMinistryOnLoad";

type TabKey = "small-groups" | "prayer" | "ministry-development";

type Tab = {
  key: TabKey;
  label: string;
  image: string;
  lede: string;
  focus: { title: string; body: string }[];
  scriptures: string[];
};

const TABS: readonly Tab[] = [
  {
    key: "small-groups",
    label: "Small Groups",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2400&auto=format&fit=crop",
    lede:
      "The heartbeat of intimate fellowship and spiritual growth within theWalk. It exists to create safe, consistent, and Spirit-led spaces where individuals can build deep relationships, explore the Word of God, and grow in faith together. These groups are small in size but through encouraging honest conversation, shared experiences, accountability, and personal discipleship are big in impact. Whether you're new to the faith or maturing in your walk with Christ, small groups offer a place where everyone is seen, heard, and supported.",
    focus: [
      {
        title: "Fellowship and Connection",
        body: "Small groups create close-knit environments where individuals can build meaningful relationships.",
      },
      {
        title: "Biblical Discussion",
        body:
          "Participants engage in open discussions around Scripture, deepening understanding through dialogue.",
      },
      {
        title: "Spiritual Accountability",
        body:
          "Members encourage one another to stay committed and consistent in their walk with God.",
      },
      {
        title: "Prayer & Support",
        body: "Groups provide a safe space for sharing needs and praying for one another.",
      },
      {
        title: "Life Application",
        body: "Teachings are applied practically, helping individuals live out their faith daily.",
      },
    ],
    scriptures: ["Acts 2:46-47", "Galatians 6:2", "Matthew 18:20"],
  },
  {
    key: "prayer",
    label: "Prayer",
    image:
      "https://images.unsplash.com/photo-1523437237164-d442d57cc3c9?q=80&w=2400&auto=format&fit=crop",
    lede:
      "The Prayer Ministry teaches and equips believers to build a deeper relationship with God through prayer, focusing on approaching Him rightly, aligning with His will, and praying with confidence. Central to the ministry is the Court First Prayer model, which trains believers to come before God as the Righteous Judge with humility, faith, and spiritual strategy. Beyond personal prayer, the ministry fosters unity by encouraging collective intercession across churches, ministries, and denominations.",
    focus: [
      {
        title: "Teaching Prayer Principles",
        body: "Participants learn foundational principles of effective and biblically aligned prayer.",
      },
      {
        title: "Court First Prayer Training",
        body:
          "Believers are trained in approaching God with structure and understanding, emphasizing spiritual authority and alignment.",
      },
      {
        title: "Prayer Mobilization",
        body:
          "The ministry organizes collective prayer efforts to address specific needs and situations.",
      },
      {
        title: "Developing Personal Prayer Life",
        body:
          "Individuals are guided in building consistent and meaningful personal prayer habits.",
      },
      {
        title: "Strategic Intercession",
        body: "Focused intercession is used to address spiritual matters with intentionality and purpose.",
      },
    ],
    scriptures: ["Hebrews 4:16", "Luke 18:7-8", "2 Chronicles 7:14"],
  },
  {
    key: "ministry-development",
    label: "Ministry Development",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2400&auto=format&fit=crop",
    lede:
      "Ministry Development is dedicated to strengthening ministries by providing practical support, administrative assistance, and strategic resources. It focuses on helping churches and aligned nonprofits to become more efficient, effective, and sustainable. Through the collective network of ministries and non-profits, it offers temporary staffing, project facilitation, financial aid, and ministry support. Ministry Development also equips the Body of Christ through leadership training, ministry courses, and workshops to raise up capable workers for the harvest.",
    focus: [
      {
        title: "Administrative and Operational Support",
        body:
          "This ministry assists organizations with systems, processes, and structure to improve efficiency.",
      },
      {
        title: "Financial and Ministerial Aid",
        body: "Support is provided to help ministries sustain and expand their work.",
      },
      {
        title: "Staffing and Facilitation",
        body: "Temporary or ongoing personnel support is offered to meet ministry needs.",
      },
      {
        title: "Training and Equipping",
        body:
          "Leaders and workers are trained through courses and workshops to strengthen their effectiveness.",
      },
      {
        title: "Collaboration Forums",
        body:
          "Spaces are created for ministries to connect, share resources, and work together toward common goals.",
      },
    ],
    scriptures: ["Ephesians 4:11-12", "Ecclesiastes 4:9", "Galatians 6:2"],
  },
] as const;

const TAB_KEYS = TABS.map((t) => t.key);

function isTabKey(value: string | null): value is TabKey {
  return (
    value === "small-groups" || value === "prayer" || value === "ministry-development"
  );
}

export function CrossConnectMinistryTabs() {
  const tabsId = useId();
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();

  useScrollToMinistryOnLoad("cross-connect-ministries", TAB_KEYS);

  const activeFromUrl = searchParams?.get("tab") ?? null;
  const initial = isTabKey(activeFromUrl) ? activeFromUrl : "small-groups";
  const [active, setActive] = useState<TabKey>(initial);

  useEffect(() => {
    const urlTab = searchParams?.get("tab") ?? null;
    if (!isTabKey(urlTab)) return;
    setActive(urlTab);
  }, [searchParams]);

  const activeTab = useMemo(() => TABS.find((t) => t.key === active) ?? TABS[0], [active]);

  const setTab = (next: TabKey) => {
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

  const onTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, key: TabKey) => {
    const idx = TABS.findIndex((t) => t.key === key);
    if (idx < 0) return;

    const focusTab = (nextIdx: number) => {
      const next = TABS[(nextIdx + TABS.length) % TABS.length];
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
      focusTab(TABS.length - 1);
    }
  };

  return (
    <section
      id="cross-connect-ministries"
      className="relative isolate w-full scroll-mt-[120px] overflow-hidden border-t border-earth-100 py-16 md:py-24"
      aria-labelledby="cross-connect-ministries-heading"
    >
      <Image
        key={activeTab.key}
        src={activeTab.image}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        priority={false}
      />
      <div className="absolute inset-0 bg-neutral-950/50" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_20%_20%,rgba(255,255,255,0.14),transparent_60%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full px-4 md:px-8 lg:max-w-6xl lg:px-0">
        <header className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/85">
            Ministries
          </p>
          <h2
            id="cross-connect-ministries-heading"
            className="font-sans text-3xl font-semibold tracking-tight text-white md:text-4xl"
          >
            Small Groups, Prayer, Ministry Development
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] font-light leading-relaxed text-white/80 md:text-lg">
            Explore each ministry focus. Shareable links are available via the URL (for example,{" "}
            <span className="font-medium text-white">?tab=prayer</span>).
          </p>
        </header>

        <div className="mx-auto mt-10 w-full">
          <div className="mx-auto w-fit min-w-[400px] max-w-full">
            <div
              role="tablist"
              aria-label="Cross Connect ministries"
              className="flex flex-col items-stretch justify-center gap-2 rounded-[100px] border border-white/15 bg-white/10 px-[30px] py-2 backdrop-blur-md sm:flex-row sm:flex-nowrap sm:items-center"
            >
              {TABS.map((t) => {
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
                    className={`inline-flex w-full items-center justify-center whitespace-nowrap rounded-[50px] px-[25px] py-3 text-sm font-medium tracking-tight transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/60 sm:w-auto ${
                      selected ? "bg-white text-earth-900 shadow-sm" : "text-white/85 hover:bg-white/15"
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
                {activeTab.label}
              </h3>
              <p className="mt-4 text-[15px] font-light leading-relaxed text-muted-foreground md:text-base">
                {activeTab.lede}
              </p>

              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
                <div className="rounded-2xl border border-earth-200 bg-[#faf9f7] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-earth-700">
                    Ministry focus
                  </p>
                  <ul className="mt-5 space-y-4">
                    {activeTab.focus.map((f) => (
                      <li key={f.title}>
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
                      <li key={s} className="text-sm font-medium text-earth-900">
                        <ScriptureReferenceMark reference={s} display={s} />
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 rounded-2xl border border-red-500/15 bg-red-500/5 p-5">
                    <p className="text-sm font-light leading-relaxed text-earth-800">
                      Want to connect or serve in{" "}
                      <span className="font-medium">{activeTab.label}</span>? Reach out and we’ll help you take the next
                      step.
                    </p>
                    <a
                      href={`/contact?type=serve&ministry=${encodeURIComponent(activeTab.label)}`}
                      data-button-link
                      className="mt-4 inline-flex w-fit items-center justify-center rounded-full bg-red-soft px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/15 transition-colors hover:bg-red-soft-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/60"
                    >
                      Contact us
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

