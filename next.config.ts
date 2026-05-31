import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: ".next-dev",
  outputFileTracingRoot: path.join(process.cwd()),
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    cpus: 1,
    workerThreads: false
  }
};

export default nextConfig;
