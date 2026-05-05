/**
 * Read deployment secrets at runtime. Use bracket access on `process.env` so Next.js
 * does not replace them with `undefined` at build time when secrets only exist in the container.
 */
export function getRuntimeAuthSecret(): string | undefined {
  if (typeof process === "undefined") return undefined;
  const env = process.env;
  for (const key of ["NEXTAUTH_SECRET", "AUTH_SECRET"] as const) {
    const v = env[key];
    if (typeof v === "string") {
      const t = v.trim();
      if (t.length > 0) return t;
    }
  }
  return undefined;
}

export function getRuntimeCookieDomain(): string | undefined {
  if (typeof process === "undefined") return undefined;
  const v = process.env["AUTH_COOKIE_DOMAIN"];
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}
