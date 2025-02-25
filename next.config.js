/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  images: {
    domains: ["cdn.aroundme.global"],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
