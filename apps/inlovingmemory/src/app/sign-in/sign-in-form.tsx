"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setPending(false);

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }

    if (res?.url) {
      router.push(res.url);
      router.refresh();
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form className="mt-10 space-y-6" onSubmit={onSubmit} noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-earth-800">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 w-full rounded-xl border border-earth-200 bg-white px-4 py-3 text-earth-900 shadow-sm outline-none transition focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-earth-800">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          className="mt-2 w-full rounded-xl border border-earth-200 bg-white px-4 py-3 text-earth-900 shadow-sm outline-none transition focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
        />
      </div>
      {error ? (
        <p className="text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-calm-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-calm-600 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
