"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ScriptureReferenceMark } from "@/components/scripture/ScriptureReferenceMark";
import { useScrollToMinistryOnLoad } from "@/hooks/useScrollToMinistryOnLoad";

type TabKey = "bible-study" | "series" | "mywalk";

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
    key: "bible-study",
    label: "Bible Study",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2400&auto=format&fit=crop",
    lede:
      "Bible Study Ministry is dedicated to deepening our understanding of God's Word as the foundation of our faith and relationship with Him. This ministry focuses on equipping believers with the knowledge and tools needed to rightly interpret Scripture and experience the living power of God's Word. Through interactive study, discussions and personal study, CR Bible Study seeks to build a strong, scripturally grounded community, empowering believers to confidently walk in the truth of God's Word.",
    focus: [
      {
        title: "Knowing God Through His Word",
        body:
          "This ministry emphasizes building a personal relationship with God by understanding His character and will through Scripture.",
      },
      {
        title: "Learning to Read & Interpret Scripture",
        body:
          "Participants are trained in proper biblical interpretation, enabling them to study the Word accurately and confidently.",
      },
      {
        title: "Engaging the Holy Spirit",
        body:
          "The Holy Spirit is central to understanding Scripture, guiding believers into truth and deeper revelation.",
      },
      {
        title: "Applying the Word to Daily Life",
        body:
          "Teachings are designed to be practical, helping individuals live out biblical principles in everyday situations.",
      },
      {
        title: "Strengthening Spiritual Discernment",
        body:
          "Believers develop the ability to discern truth from error, making sound spiritual decisions.",
      },
    ],
    scriptures: ["Hebrews 4:12", "2 Timothy 2:15", "John 17:17"],
  },
  {
    key: "series",
    label: "Series",
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2400&auto=format&fit=crop",
    lede:
      "theWalk Study Series is dedicated to exploring prominent, overarching biblical themes crucial for understanding God's plan and purpose in the lives of believers. Rooted in deep study and guided by timely revelations, these studies seek to bring clarity, unity, and transformation to the body of Christ. This aspect of theWalk functions as a collaborative effort, where core groups of selected individuals from various ministries/organizations come together to study and present these topics.",
    focus: [
      {
        title: "In-Depth Thematic Study",
        body:
          "The series explores major biblical themes in detail, providing a comprehensive understanding of God’s overarching plan.",
      },
      {
        title: "Bridge Between Denominations",
        body:
          "It creates unity by bringing together believers from different backgrounds to study and grow together.",
      },
      {
        title: "Holy Spirit Encouraged Revelation (Biblically Sound)",
        body:
          "Teachings are guided by the Holy Spirit while remaining grounded in Scripture, ensuring both depth and accuracy.",
      },
      {
        title: "Collective Teaching, Sharing, Accountability & Cohesion",
        body:
          "Participants contribute to and learn from one another, fostering a culture of shared growth and responsibility.",
      },
      {
        title: "Equipping the Church",
        body:
          "The ultimate goal is to prepare believers to serve effectively within the Body of Christ.",
      },
    ],
    scriptures: ["Ephesians 4:13", "John 16:13", "2 Timothy 3:16-17"],
  },
  {
    key: "mywalk",
    label: "MyWalk",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2400&auto=format&fit=crop",
    lede:
      "The MyWalk Ministry is a discipleship-based ministry focused on the individual journey of the more seasoned believer. It provides support, encouragement, and spiritual guidance, helping individuals to move into their promised place or purpose with faith. At its core, MyWalk is about identifying and moving into God's will for our lives. It emphasizes inner healing and developing spiritual fortitude through deliverance, prayer, fasting, biblical teaching, mentorship and counseling.",
    focus: [
      {
        title: "Healing & Deliverance",
        body:
          "myWalk addresses deeper personal and spiritual issues, helping individuals experience healing and freedom.",
      },
      {
        title: "Purpose Discovery",
        body:
          "Participants are guided in identifying their calling and aligning their lives with God’s purpose.",
      },
      {
        title: "Acquiring Natural and Spiritual Tools and Disciplines",
        body:
          "The ministry equips individuals with both practical habits and spiritual disciplines necessary for growth.",
      },
      {
        title: "Mentorship & Accountability",
        body:
          "Ongoing mentorship provides guidance, while accountability ensures consistency and progress.",
      },
      {
        title: "Support (Natural and Spiritual)",
        body:
          "myWalk offers holistic support, addressing both everyday challenges and spiritual development.",
      },
    ],
    scriptures: ["Jeremiah 29:13", "Proverbs 11:14", "Philippians 2:4"],
  },
] as const;

const TAB_KEYS = TABS.map((t) => t.key);

function isTabKey(value: string | null): value is TabKey {
  return value === "bible-study" || value === "series" || value === "mywalk";
}

export function CrossRoadsMinistryTabs() {
  const tabsId = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useScrollToMinistryOnLoad("cross-roads-ministries", TAB_KEYS);

  const activeFromUrl = searchParams.get("tab");
  const initial = isTabKey(activeFromUrl) ? activeFromUrl : "bible-study";
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
      id="cross-roads-ministries"
      className="relative isolate w-full scroll-mt-[120px] overflow-hidden border-t border-earth-100 py-16 md:py-24"
      aria-labelledby="cross-roads-ministries-heading"
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
            id="cross-roads-ministries-heading"
            className="font-sans text-3xl font-semibold tracking-tight text-white md:text-4xl"
          >
            Bible Study, Series, MyWalk
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] font-light leading-relaxed text-white/80 md:text-lg">
            Explore each ministry focus. Shareable links are available via the URL (for example,{" "}
            <span className="font-medium text-white">?tab=mywalk</span>).
          </p>
        </header>

        <div className="mx-auto mt-10 w-full">
          <div className="mx-auto w-full max-w-[400px]">
            <div
              role="tablist"
              aria-label="Cross Roads ministries"
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

