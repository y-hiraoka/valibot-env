import nextra from "nextra";
import NextBundleAnalyzer from "@next/bundle-analyzer";

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/valibot-env",
  images: { unoptimized: true },
};

export default withBundleAnalyzer(withNextra(nextConfig));
