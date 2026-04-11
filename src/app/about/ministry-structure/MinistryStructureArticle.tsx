"use client";

import Image from "next/image";
import Link from "next/link";
import { ScriptureEnhance } from "@/components/scripture/ScriptureEnhance";
import { InlineScriptureRefs } from "@/components/scripture/ScriptureSupportLine";

export function MinistryStructureArticle() {
  return (
    <article className="bg-background pb-24 pt-28 md:pb-32 md:pt-36">
      <div className="container mx-auto max-w-6xl px-4">
        <nav aria-label="Breadcrumb" className="mb-10">
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-earth-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth-900"
          >
            ← Back to About
          </Link>
        </nav>

        <ScriptureEnhance>
          <section
            className="mb-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-14"
            aria-labelledby="ministry-structure-heading"
          >
            <div className="order-1 space-y-8 lg:order-none">
              <div className="max-w-3xl space-y-4">
                <h1
                  id="ministry-structure-heading"
                  className="text-3xl font-normal tracking-tight text-earth-900 md:text-4xl"
                >
                  Ministry Structure
                </h1>
                <p className="text-[15px] font-light leading-relaxed text-muted-foreground">
                  Servant leadership, accountability, and how authority and care flow through theWalk.
                </p>
              </div>
              <figure className="w-full">
                <div className="relative aspect-[800/568] w-full">
                  <Image
                    src="/assets/servant-leadership-structure-2.png"
                    alt="Organizational chart: Jesus as foundation, mission and vision, core team, visionary, senior counsel, public ministry, and ecclesia connected by red lines."
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 28rem"
                    priority
                  />
                </div>
              </figure>
            </div>

            <div className="order-2 space-y-6 rounded-2xl p-6 shadow-sm md:p-8 lg:order-none lg:self-start">
              <div>
                <h3 className="text-lg font-medium uppercase tracking-wide text-earth-900">
                  Servant management
                </h3>
                <p className="mt-1 text-[15px] font-light leading-relaxed text-muted-foreground">
                  Groups / layers serve the area(s) directly above them. Groups support those who depend
                  upon them; authority flows up. Authoritative priority will be higher at lower levels of
                  the structure and will proceed up from the bottom tier. By this, we acknowledge and
                  emphasize the servant leadership paradigm which Jesus taught. In this system of
                  governance, Jesus is the foundation.
                </p>
                <InlineScriptureRefs className="mt-3 text-sm font-medium tracking-wide text-earth-500">
                  Matthew 23:11, 1 Corinthians 3:11
                </InlineScriptureRefs>
              </div>

              <div>
                <h3 className="text-lg font-medium uppercase tracking-wide text-earth-900">
                  Discipleship <span className="font-normal text-earth-500">|</span> Fellowship
                </h3>
                <p className="mt-1 text-[15px] font-light leading-relaxed text-muted-foreground">
                  Groups are accountable for every layer beside them. With this, we utilize the Jewish
                  discipleship and study practice of Jesus&apos; day, where persons were encouraged to
                  grow together in small intimate groups or &apos;haverim&apos;.
                </p>
                <InlineScriptureRefs className="mt-3 text-sm font-medium tracking-wide text-earth-500">
                  Luke 10:1
                </InlineScriptureRefs>
              </div>

              <div>
                <h3 className="text-lg font-medium uppercase tracking-wide text-earth-900">Focus</h3>
                <p className="mt-1 text-[15px] font-light leading-relaxed text-muted-foreground">
                  Decisions made from those at lower levels of the structure will be focused at providing
                  benefit to those who reside at the top tiers of the structure, so that beneficial
                  priority for decisions made will proceed down from the top. By this we emphasize
                  Jesus&apos; evangelistic focus where the physician comes to the sick and not those who
                  are well.
                </p>
                <InlineScriptureRefs className="mt-3 text-sm font-medium tracking-wide text-earth-500">
                  Mark 2:17
                </InlineScriptureRefs>
              </div>
            </div>
          </section>

          <section className="mt-20" aria-labelledby="ministry-structure-system-heading">
            <div className="space-y-10 rounded-2xl bg-muted px-6 py-12 md:px-10 md:py-16">
              <h2 id="ministry-structure-system-heading" className="text-2xl font-normal text-earth-900">
                System details
              </h2>

              <div>
                <h3 className="text-lg font-medium text-earth-900">Unity</h3>
                <p className="mt-4 text-[15px] font-light leading-relaxed text-muted-foreground">
                  Critical to the system&apos;s success is the requirement to see everyone as a part of
                  God&apos;s image; at all levels it must be observed that the image of God the Father is
                  embedded within all. We must take this into consideration and regularly obtain input
                  from all levels of the system, especially the top and bottom layers. To signify this
                  commonality between the components of the body, the red line from the layer of Jesus
                  Christ our redeemer reaches all persons in the system, in which the Spirit of God
                  dwells.
                </p>
                <InlineScriptureRefs className="mt-3 text-sm font-medium tracking-wide text-earth-500">
                  1 Corinthians 12:4–13
                </InlineScriptureRefs>
              </div>

              <div>
                <h3 className="text-lg font-medium text-earth-900">Foundation (Jesus)</h3>
                <p className="mt-4 text-[15px] font-light leading-relaxed text-muted-foreground">
                  Jesus (the Word of God) is the foundation upon which the ministry is to be built. He is
                  to have ultimate authority of this, His Body, and from where He resides His authority
                  and nature flow to the entire body through the Holy Spirit on which we are all
                  dependent. As with any foundation or cornerstone, the weight and the stability of the
                  entire structure rely upon Him.
                </p>
                <InlineScriptureRefs className="mt-3 text-sm font-medium tracking-wide text-earth-500">
                  1 Corinthians 3:11, Matthew 7:24–27
                </InlineScriptureRefs>
              </div>

              <div>
                <h3 className="text-lg font-medium text-earth-900">Mission and vision</h3>
                <p className="mt-4 text-[15px] font-light leading-relaxed text-muted-foreground">
                  The mission and vision given by Christ are to govern the activities and focus of the
                  ministry. The main activity of the visionary is to ensure that the mission and vision
                  are accomplished and that they stay true to what was originally given. The ability to
                  fulfil the task given is heavily based upon these two elements; this power is often
                  referred to as the anointing of a ministry, and is based entirely on the purpose of the
                  ministry.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-earth-900">The working layer / core team</h3>
                <p className="mt-4 text-[15px] font-light leading-relaxed text-muted-foreground">
                  The working layer, comprised of the core team, the visionary team, and the senior
                  counsel, will focus on fulfilling the criteria for the mission and vision of the
                  ministry. The core team will focus on the mission, the senior counsel will focus on the
                  vision, and the visionary team will facilitate them while focusing on oversight and
                  balance.
                </p>
              </div>
            </div>
          </section>
        </ScriptureEnhance>
      </div>
    </article>
  );
}
