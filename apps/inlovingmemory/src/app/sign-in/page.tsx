import Link from "next/link";
import { Suspense } from "react";
import { SignInForm } from "@/app/sign-in/sign-in-form";
import { getThewalkPublicOrigin } from "@/lib/ilm-thewalk";

export const metadata = {
  title: "Sign in · inLovingMemory",
};

function SignInFormFallback() {
  return (
    <div className="mt-10 h-48 animate-pulse rounded-lg bg-earth-100/80" aria-hidden />
  );
}

export default function SignInPage() {
  const origin = getThewalkPublicOrigin();

  return (
    <main className="mx-auto max-w-md px-6 py-16 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-earth-500">Page keeper</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-earth-900">Sign in</h1>
      <p className="mt-3 text-sm leading-relaxed text-earth-700">
        Use the same email and password as your theWalk account. New here?{" "}
        <Link className="font-medium text-earth-900 underline underline-offset-4" href={`${origin}/register`}>
          Create an account
        </Link>{" "}
        on theWalk first.
      </p>
      <Suspense fallback={<SignInFormFallback />}>
        <SignInForm />
      </Suspense>
    </main>
  );
}
