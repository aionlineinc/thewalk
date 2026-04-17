"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useMemo, useState } from "react";

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}

export function SignInClient() {
  const searchParams = useSearchParams();
  const callbackUrl = useMemo(() => searchParams.get("callbackUrl") ?? "/admin", [searchParams]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section
      id="sign-in-card"
      className="w-full max-w-[520px] rounded-2xl bg-white px-10 py-10 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.55)]"
    >
      <p className="text-sm font-semibold tracking-tight text-earth-900">theWalk</p>

      <h1 id="sign-in-form-heading" className="mt-8 text-4xl font-semibold tracking-tight text-earth-900">
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-earth-900 underline underline-offset-4">
          Create my account
        </Link>
      </p>

      <form
        id="sign-in-form"
        className="mt-8 space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setPending(true);

          const form = e.currentTarget;
          const formData = new FormData(form);
          const email = String(formData.get("email") ?? "");
          const password = String(formData.get("password") ?? "");

          const res = await signIn("credentials", {
            email,
            password,
            callbackUrl,
            redirect: false,
          });

          setPending(false);
          if (!res || res.error) {
            setError("Invalid email or password.");
            return;
          }
          window.location.href = res.url ?? callbackUrl;
        }}
      >
        <div>
          <label htmlFor="sign-in-email" className="block text-xs font-medium text-earth-700">
            Email
          </label>
          <input
            id="sign-in-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Your email"
            required
            className="mt-2 w-full rounded-xl border border-earth-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-earth-900/50 focus:ring-4 focus:ring-earth-900/5"
          />
        </div>
        <div>
          <label htmlFor="sign-in-password" className="block text-xs font-medium text-earth-700">
            Password
          </label>
          <div className="relative mt-2">
            <input
              id="sign-in-password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="Your password"
              required
              className="w-full rounded-xl border border-earth-200 bg-white px-4 py-3 pr-11 text-sm outline-none transition-colors focus:border-earth-900/50 focus:ring-4 focus:ring-earth-900/5"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-3 text-earth-500 transition-colors hover:text-earth-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth-900/30"
              onClick={() => setShowPassword((v) => !v)}
            >
              <EyeIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {error ? (
          <p className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-900">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-[#0f0f10] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth-900/40"
        >
          {pending ? "Logging in…" : "Login"}
        </button>
      </form>

      <div className="mt-5 text-sm text-earth-700">
        <p>
          Forgot your login details?{" "}
          <Link href="#" className="font-medium text-red-700 underline underline-offset-4">
            Reset password
          </Link>
        </p>
        <p className="mt-2">
          <Link href="#" className="font-medium text-red-700 underline underline-offset-4">
            Sign in with magic link.
          </Link>
        </p>
      </div>

      <div className="mt-12 flex items-center gap-6 text-xs text-muted-foreground">
        <Link href="/privacy" className="underline underline-offset-4 hover:text-earth-900">
          Privacy Policy
        </Link>
        <Link href="/terms" className="underline underline-offset-4 hover:text-earth-900">
          Terms of Service
        </Link>
      </div>
    </section>
  );
}

