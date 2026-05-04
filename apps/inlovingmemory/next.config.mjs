/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

if (process.env.NODE_ENV === "production") {
  nextConfig.output = "standalone";
}

export default nextConfig;
