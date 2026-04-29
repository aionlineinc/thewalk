import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Growth | theWalk Ministries",
  description:
    "Pastoral care, equipping, and practical support from theWalk — how to request help and what to expect.",
};

const SERVICES = [
  {
    title: "Pastoral care",
    body: "Crisis prayer, visitation, and spiritual direction. Requests are received with discretion and care.",
    includes: ["Prayer support", "Spiritual direction", "Care coordination"],
    action: { label: "Request care", href: "/contact?type=care" },
  },
  {
    title: "Equipping & training",
    body: "Workshops for hosts, leaders, and teams — Scripture-first facilitation and healthy culture.",
    includes: ["Leader formation", "Facilitation practices", "Healthy culture"],
    action: { label: "Ask about training", href: "/contact?type=training" },
  },
  {
    title: "Technical support",
    body: "Practical help for ministries and charities that need stable, secure, and maintainable systems.",
    includes: ["Web + email setup", "Simple automation", "Security baselines"],
    action: { label: "Request support", href: "/contact?type=tech-support" },
  },
  {
    title: "Administrative consulting",
    body: "Operational clarity for teams — processes that reduce friction and protect the mission.",
    includes: ["Workflow design", "Documentation & onboarding", "Policy + structure review"],
    action: { label: "Start a consult", href: "/contact?type=admin-consulting" },
  },
  {
    title: "Ministry placement",
    body: "Explore how your gifts align with teams and pathways across theWalk.",
    includes: ["Next steps", "Team fit", "Serving pathways"],
    action: { label: "Get involved", href: "/get-involved" },
  },
];

export default function GrowthServicesPage() {
  return (
    <section className="border-b border-gray-100 bg-white pb-24 pt-28 md:pb-32 md:pt-40" aria-labelledby="services-title">
      <div className="mx-auto max-w-content px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Growth</p>
          <h1 id="services-title" className="mt-3 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
            Services
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-gray-600 md:text-lg">
            Practical help from theWalk team — from first conversations to ongoing support. Every path starts with a
            simple conversation.
          </p>
        </div>

        <ul className="mt-16 grid list-none gap-6 p-0 md:grid-cols-2 lg:gap-8">
          {SERVICES.map((s) => (
            <li key={s.title} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-gray-50/80 p-8 shadow-sm">
                <h2 className="text-xl font-semibold tracking-tight text-gray-900">{s.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{s.body}</p>

                {s.includes?.length ? (
                  <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-gray-600">
                    {s.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-8">
                  <Link
                    href={s.action.href}
                    data-button-link
                    className="inline-flex rounded-full bg-red-soft px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-soft-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
                  >
                    {s.action.label}
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-14 text-center text-sm text-gray-500">
          Looking for downloads and links? Browse{" "}
          <Link href="/growth/resources" className="font-medium text-red-900 underline-offset-2 hover:underline">
            Resources
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
