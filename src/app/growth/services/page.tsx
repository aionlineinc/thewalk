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
    action: { label: "Request care", href: "/contact?type=care" },
  },
  {
    title: "Equipping & training",
    body: "Workshops for hosts, leaders, and teams — Scripture-first facilitation and healthy culture.",
    action: { label: "Ask about training", href: "/contact?type=training" },
  },
  {
    title: "Ministry placement",
    body: "Explore how your gifts align with teams and pathways across theWalk.",
    action: { label: "Get involved", href: "/get-involved" },
  },
];

export default function GrowthServicesPage() {
  return (
    <div className="bg-white pb-24 pt-28 md:pb-32 md:pt-36">
      <div className="mx-auto max-w-content px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Growth</p>
        <h1 className="mt-3 text-4xl font-normal tracking-tight text-gray-900 md:text-5xl">Services</h1>
        <p className="mt-5 text-[15px] leading-relaxed text-gray-600 md:text-lg">
          Practical help from theWalk team — from first conversations to ongoing support. Every path starts with a
          simple conversation.
        </p>

        <ul className="mt-14 flex list-none flex-col gap-10 border-t border-gray-100 p-0 pt-14">
          {SERVICES.map((s) => (
            <li key={s.title} className="border-b border-gray-100 pb-10 last:border-b-0 last:pb-0">
              <h2 className="text-xl font-medium tracking-tight text-gray-900 md:text-2xl">{s.title}</h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-600">{s.body}</p>
              <Link
                href={s.action.href}
                data-button-link
                className="mt-6 inline-flex rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:border-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
              >
                {s.action.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-14 text-sm text-gray-500">
          Browse downloadable forms and links on the{" "}
          <Link href="/growth/resources" className="font-medium text-red-900 underline-offset-2 hover:underline">
            Resources
          </Link>{" "}
          page.
        </p>
      </div>
    </div>
  );
}
