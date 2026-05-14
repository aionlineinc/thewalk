import path from "node:path";
import os from "node:os";

/**
 * iCloud / cloud-synced project roots corrupt `.next` (missing chunks like `./135.js`).
 * Only `next dev` should write its cache outside the repo — never `next build` / `next start`
 * (Docker and production rely on in-repo `.next`).
 *
 * Opt out: USE_LOCAL_NEXT_CACHE=0
 */
function devDistDir() {
  if (process.env.USE_LOCAL_NEXT_CACHE === "0") return undefined;
  const isDevServer = process.argv.includes("dev");
  if (!isDevServer) return undefined;

  const home = os.homedir();
  return process.platform === "darwin"
    ? path.join(home, "Library", "Caches", "thewalk-ilm-next")
    : path.join(os.tmpdir(), "thewalk-ilm-next");
}

const localDevDist = devDistDir();

/**
 * Allow `next/image` to load Directus `/assets/{id}` URLs (marketing heroes, cards, etc.).
 * Must match the CMS host used at runtime; include env URLs so local / staging CMS works.
 */
function directusAssetRemotePatterns() {
  /** @type {import('next').RemotePattern[]} */
  const patterns = [];
  const seen = new Set();

  function addFromUrl(raw) {
    if (!raw || typeof raw !== "string") return;
    const trimmed = raw.trim();
    if (!trimmed) return;
    try {
      const u = new URL(trimmed);
      const protocol = u.protocol === "https:" ? "https" : "http";
      const key = `${protocol}://${u.hostname}${u.port ? `:${u.port}` : ""}`;
      if (seen.has(key)) return;
      seen.add(key);
      patterns.push({
        protocol,
        hostname: u.hostname,
        ...(u.port ? { port: u.port } : {}),
        pathname: "/assets/**",
      });
    } catch {
      /* ignore invalid env */
    }
  }

  addFromUrl("https://cms.thewalk.org");
  addFromUrl(process.env.NEXT_PUBLIC_CMS_URL);
  addFromUrl(process.env.DIRECTUS_URL);
  addFromUrl(process.env.NEXT_PUBLIC_DIRECTUS_URL);

  return patterns;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(localDevDist ? { distDir: localDevDist } : {}),
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      ...directusAssetRemotePatterns(),
    ],
  },
};

if (process.env.NODE_ENV === "production") {
  nextConfig.output = "standalone";
}

export default nextConfig;
