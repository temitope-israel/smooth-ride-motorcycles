import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // This is a valid property in Next.js,
    // but TypeScript needs the correct type definition to see it.
    ignoreDuringBuilds: true,
  },
  // If you also want to ignore TypeScript errors during builds:
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;