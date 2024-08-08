import { defineConfig } from "tsup";

export default defineConfig([
  {
    format: "esm",
    target: "es2022",
    entry: ["src", "!src/**/*.test.{ts,tsx}"],
    outDir: "dist",
    dts: true,
    bundle: false,
    sourcemap: true,
  },
]);
