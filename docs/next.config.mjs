import nextra from "nextra";

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/valibot-env",
  images: { unoptimized: true },
};

export default withNextra(nextConfig);
