"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ScriptureReferenceMark } from "@/components/scripture/ScriptureReferenceMark";

type TabKey = "rugged" | "covered" | "exodus";

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
    key: "rugged",
    label: "Rugged",
    image:
      "https://images.unsplash.com/photo-1523437237164-d442d57cc3c9?q=80&w=2400&auto=format&fit=crop",
    lede:
      "Rugged exists to reach individuals from all walks of life. Developed for those who have faced extreme challenges, it emphasizes the power and scope of the amazing redemptive power of Jesus' sacrifice. It's for those whose lives due to circumstances or choices may not align well with society's expectations; offering hope and a fresh start.",
    focus: [
      {
        title: "Spiritual Development",
        body:
          "Rugged introduces individuals to Christ and nurtures foundational faith, helping them begin or restore their relationship with God through teaching, prayer, and discipleship.",
      },
      {
        title: "Personal Development & Life Skills",
        body:
          "Participants are equipped with practical life skills such as communication, discipline, and decision-making, enabling them to function effectively in everyday life.",
      },
      {
        title: "Education & Career Development",
        body:
          "The ministry supports access to education, vocational training, and employment pathways, helping individuals build sustainable and productive futures.",
      },
      {
        title: "Community Reintegration & Social Support",
        body:
          "Rugged assists individuals in re-entering society with confidence by providing guidance, accountability, and connection to supportive networks.",
      },
      {
        title: "Aftercare & Transitional Housing (Covered)",
        body:
          "Through partnership with Covered, Rugged ensures continued support beyond initial outreach, helping individuals transition into stable living environments.",
      },
    ],
    scriptures: ["1 Timothy 1:12-16", "Jeremiah 29:11"],
  },
  {
    key: "covered",
    label: "Covered",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2400&auto=format&fit=crop",
    lede:
      "Covered Ministries provide a sanctuary of safety, restoration, and spiritual growth for individuals at critical periods of their walk. We offer temporary housing, essential resources, and mentorship for new converts, believers facing challenging circumstances, and those seeking to grow deeper in their faith. Rooted in the love of Christ, we extend His covering to those in need, fostering a supportive environment for transformation, training, and service.",
    focus: [
      {
        title: "Temporary Housing & Help (Hostile Environments)",
        body:
          "Covered offers safe accommodation for individuals escaping unsafe or unstable environments, providing immediate relief and protection during critical moments.",
      },
      {
        title: "Ministry Training (Discipleship & Growth)",
        body:
          "Residents are engaged in structured discipleship programs designed to deepen their understanding of God and strengthen their spiritual foundation.",
      },
      {
        title: "Retreats & Temporary Getaways",
        body:
          "Intentional retreats provide space for rest, reflection, and spiritual renewal, allowing individuals to reconnect with God away from daily pressures.",
      },
      {
        title: "Personal Development & Life Skills",
        body:
          "Covered reinforces personal growth through training in responsibility, time management, and healthy lifestyle practices.",
      },
      {
        title: "Education & Career Development",
        body:
          "Participants receive support in pursuing education or employment opportunities, helping them prepare for long-term independence.",
      },
    ],
    scriptures: ["Matthew 25:35-36", "Psalm 91:1"],
  },
  {
    key: "exodus",
    label: "Exodus",
    image:
      "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2400&auto=format&fit=crop",
    lede:
      "Exodus is a ministry dedicated to guiding individuals on a journey of deliverance, purity, and transformation. Rooted in the power of God's Word, Exodus helps individuals break free from the chains of sin, harmful patterns, and worldly influences, equipping them to walk in holiness and freedom. By teaching spiritual truths and fostering accountability, Exodus empowers individuals to leave behind the familiar but destructive elements of the world that hinder their relationship with God and embrace His purpose for their lives.",
    focus: [
      {
        title: "Deliverance & Healing",
        body:
          "Exodus addresses spiritual strongholds and emotional wounds through prayer, teaching, and guided processes of healing and freedom.",
      },
      {
        title: "Leaving the World Behind",
        body:
          "Participants are guided in separating from harmful environments, habits, and influences that hinder their relationship with God.",
      },
      {
        title: "Pursuit of Purity",
        body:
          "The ministry emphasizes holy living, encouraging individuals to align their thoughts, behaviors, and desires with biblical standards.",
      },
      {
        title: "Spiritual Growth & Discipleship",
        body:
          "Through teaching and accountability, individuals are equipped to grow consistently in their walk with Christ.",
      },
      {
        title: "Integration with Rugged & Covered",
        body:
          "Exodus works in conjunction with other ministries to ensure a holistic transformation, supporting individuals across all stages of their journey.",
      },
    ],
    scriptures: ["Exodus 14:13-14", "2 Corinthians 6:17-18", "Romans 12:2"],
  },
] as const;

function isTabKey(value: string | null): value is TabKey {
  return value === "rugged" || value === "covered" || value === "exodus";
}

export function CrossOverMinistryTabs() {
  const tabsId = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeFromUrl = searchParams.get("tab");
  const initial = isTabKey(activeFromUrl) ? activeFromUrl : "rugged";
  const [active, setActive] = useState<TabKey>(initial);

  useEffect(() => {
    const urlTab = searchParams.get("tab");
    if (!isTabKey(urlTab)) return;
    setActive(urlTab);
  }, [searchParams]);

  const activeTab = useMemo(() => TABS.find((t) => t.key === active) ?? TABS[0], [active]);

  const setTab = (next: TabKey) => {
    setActive(next);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", next);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
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
      id="cross-over-ministries"
      className="relative isolate w-full overflow-hidden border-t border-earth-100 py-16 md:py-24"
      aria-labelledby="cross-over-ministries-heading"
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_20%_20%,rgba(255,255,255,0.14),transparent_60%)]" aria-hidden />

      <div className="relative z-10 mx-auto w-full px-4 md:px-8 lg:max-w-6xl lg:px-0">
        <header className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/85">
            Ministries
          </p>
          <h2
            id="cross-over-ministries-heading"
            className="font-sans text-3xl font-semibold tracking-tight text-white md:text-4xl"
          >
            Rugged, Covered, Exodus
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] font-light leading-relaxed text-white/80 md:text-lg">
            Explore each ministry focus. Shareable links are available via the URL (for example,{" "}
            <span className="font-medium text-white">?tab=exodus</span>).
          </p>
        </header>

        <div className="mx-auto mt-10 w-full">
          <div className="mx-auto w-full max-w-[400px]">
            <div
              role="tablist"
              aria-label="Cross Over ministries"
              className="flex flex-col items-stretch justify-center gap-2 rounded-[100px] border border-white/15 bg-white/10 px-[30px] py-2 backdrop-blur-md sm:flex-row sm:items-center"
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
                    className={`inline-flex w-full items-center justify-center rounded-[50px] px-[25px] py-3 text-sm font-medium tracking-tight transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/60 sm:w-auto ${
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

