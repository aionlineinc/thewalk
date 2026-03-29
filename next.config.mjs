import path from "node:path";
import os from "node:os";

/**
 * iCloud / cloud-synced project roots make `.next` extremely slow (many small files).
 * When USE_LOCAL_NEXT_CACHE=1 (set by npm dev scripts), write dev artifacts under a
 * local disk cache instead of the repo folder.
 */
function devDistDir() {
  if (process.env.USE_LOCAL_NEXT_CACHE !== "1") return undefined;
  const home = os.homedir();
  const base =
    process.platform === "darwin"
      ? path.join(home, "Library", "Caches", "thewalk-next")
      : path.join(os.tmpdir(), "thewalk-next");
  return path.join(base, ".next-dev");
}

const localDevDist = devDistDir();

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(localDevDist ? { distDir: localDevDist } : {}),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thewalk.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

// Standalone output is for production (`next build`); including it in dev can
// contribute to odd dev-server behavior on some setups.
if (process.env.NODE_ENV === "production") {
  nextConfig.output = "standalone";
}

export default nextConfig;
