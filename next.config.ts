import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import bundleAnalyzer from "@next/bundle-analyzer";

if (process.env.NODE_ENV !== "production" || !process.env.CI) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = (phase: string): NextConfig => ({
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-preview" : ".next",
  experimental: {
    optimizePackageImports: ["lucide-react", "motion", "gsap", "d3", "zod"],
  },
});

export default withBundleAnalyzer(nextConfig);

