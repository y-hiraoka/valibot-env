import { describe, expect, it } from "vitest";
import * as v from "valibot";
import { createEnv } from "./nextjs";

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

  describe("test types", () => {
    it("should pass type check", () => {
      expect(() => {
        createEnv({
          schema: {
            public: {
              NEXT_PUBLIC_VALUE_IN_PUBLIC: v.string(),
              // @ts-expect-error should not allow non-prefixed value
              WITHOUT_PREFIX_VALUE_IN_PUBLIC: v.string(),
            },
            private: {
              WITHOUT_PREFIX_VALUE_IN_PRIVATE: v.string(),
              // @ts-expect-error should not allow public value in private schema
              NEXT_PUBLIC_VALUE_IN_PRIVATE: v.string(),
            },
          },
          // @ts-expect-error should not allow missing value
          values: {
            NEXT_PUBLIC_VALUE_IN_PUBLIC: "value",
            NEXT_PUBLIC_VALUE_IN_PRIVATE: "value",
            WITHOUT_PREFIX_VALUE_IN_PUBLIC: "value",
          },
        });
      }).toThrowError();
    });
  });
});
