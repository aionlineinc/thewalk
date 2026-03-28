import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/ui/Hero";

export const metadata: Metadata = {
  title: "Create an account | theWalk Ministries",
  description: "Sign in or create access to theWalk resources and community tools.",
};

export default function RegisterPage() {
  return (
    <>
      <Hero
        headline="Join theWalk online"
        subtext="Account creation is handled through our secure sign-in flow. Use the link below to get started."
      />
      <section className="border-b border-gray-100 bg-muted py-16 md:py-24">
        <div className="container mx-auto max-w-[650px] px-4 text-center">
          <p className="text-base font-light leading-relaxed text-gray-600">
            If you already have credentials, sign in. Need help? Contact us and we will assist.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/sign-in"
              className="inline-flex rounded-full bg-[#fb5e32] px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-orange-500/20 transition-colors hover:bg-[#fb5e32]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb5e32]"
            >
              Go to sign in
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-600 underline-offset-4 transition-colors hover:text-[#fb5e32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fb5e32]"
            >
              Contact support
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
