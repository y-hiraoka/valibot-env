import { createEnv } from "./nextjs";
import { describe, expect, it } from "vitest";
import * as v from "valibot";

describe("createEnv for Next.js", () => {
  it("should create variables for public env", () => {
    const env = createEnv({
      isPrivate: false,
      schema: {
        public: {
          NEXT_PUBLIC_VERCEL_URL: v.string(),
        },
        private: {
          API_KEY: v.string(),
        },
        shared: {
          NODE_ENV: v.union([
            v.literal("development"),
            v.literal("production"),
          ]),
        },
      },
      values: {
        NEXT_PUBLIC_VERCEL_URL: "https://example.com",
        API_KEY: "secret",
        NODE_ENV: "development",
      },
    });

    expect(env).toStrictEqual({
      NEXT_PUBLIC_VERCEL_URL: "https://example.com",
      NODE_ENV: "development",
    });
  });

  it("should create variables for private env", () => {
    const env = createEnv({
      isPrivate: true,
      schema: {
        public: {
          NEXT_PUBLIC_VERCEL_URL: v.string(),
        },
        private: {
          API_KEY: v.string(),
        },
        shared: {
          NODE_ENV: v.union([
            v.literal("development"),
            v.literal("production"),
          ]),
        },
      },
      values: {
        NEXT_PUBLIC_VERCEL_URL: "https://example.com",
        API_KEY: "secret",
        NODE_ENV: "development",
      },
    });

    expect(env).toStrictEqual({
      NEXT_PUBLIC_VERCEL_URL: "https://example.com",
      API_KEY: "secret",
      NODE_ENV: "development",
    });
  });
});
