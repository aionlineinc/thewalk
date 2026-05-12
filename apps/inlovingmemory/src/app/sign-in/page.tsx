import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { SignInForm } from "@/app/sign-in/sign-in-form";
import { getIlmMarketingContent } from "@/lib/cms/ilm-content";
import { getThewalkPublicOrigin } from "@/lib/ilm-thewalk";

export const metadata = {
  title: "Sign in · inLovingMemory",
};

function SignInFormFallback() {
  return <div className="mt-8 h-52 animate-pulse rounded-xl bg-earth-100/80" aria-hidden />;
}

export default async function SignInPage() {
  const origin = getThewalkPublicOrigin();
  const content = await getIlmMarketingContent();

  return (
    <main className="grid min-h-[calc(100vh-80px)] md:grid-cols-2">
      {/* Left — atmospheric photo panel */}
      <div className="relative hidden overflow-hidden md:block">
        <Image
          src={content.signIn.panelImageUrl}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0806]/80 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-[#7c4a1e]/15 mix-blend-overlay" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
            inLovingMemory
          </p>
          <blockquote className="mt-4 max-w-xs text-2xl font-light leading-snug text-white/90">
            {`"${content.signIn.quote}"`}
          </blockquote>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-col justify-center bg-white px-8 py-16 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-earth-400">
            Page moderator
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-earth-900">Sign in</h1>
          <p className="mt-3 text-sm leading-relaxed text-earth-600">
            Use the same email and password as your theWalk account. New here?{" "}
            <Link
              className="font-medium text-earth-900 underline underline-offset-4 transition hover:text-calm-600"
              href={`${origin}/register`}
            >
              Create an account
            </Link>{" "}
            on theWalk first.
          </p>
          <Suspense fallback={<SignInFormFallback />}>
            <SignInForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
