import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import bundleAnalyzer from "@next/bundle-analyzer";

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
