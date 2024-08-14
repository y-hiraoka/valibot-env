import { describe, it, expect } from "vitest";
import * as v from "valibot";
import { createEnv } from ".";

describe("createEnv", () => {
  it("should create public env", () => {
    const env = createEnv({
      publicPrefix: "PUBLIC_",
      isPrivate: true,
      schema: {
        public: {
          PUBLIC_STRING_VALUE: v.string(),
          PUBLIC_NUMBER_VALUE: v.number(),
        },
      },
      values: {
        PUBLIC_STRING_VALUE: "foo",
        PUBLIC_NUMBER_VALUE: 42,
      },
    });

    expect(env).toStrictEqual({
      PUBLIC_STRING_VALUE: "foo",
      PUBLIC_NUMBER_VALUE: 42,
    });
  });

  it("should create private env", () => {
    const env = createEnv({
      privatePrefix: "PRIVATE_",
      isPrivate: true,
      schema: {
        private: {
          PRIVATE_STRING_VALUE: v.string(),
          PRIVATE_NUMBER_VALUE: v.number(),
        },
      },
      values: {
        PRIVATE_STRING_VALUE: "foo",
        PRIVATE_NUMBER_VALUE: 42,
      },
    });

    expect(env).toStrictEqual({
      PRIVATE_STRING_VALUE: "foo",
      PRIVATE_NUMBER_VALUE: 42,
    });
  });

  it("should create shared env", () => {
    const env = createEnv({
      isPrivate: true,
      schema: {
        shared: {
          SHARED_STRING_VALUE: v.string(),
          SHARED_NUMBER_VALUE: v.number(),
        },
      },
      values: {
        SHARED_STRING_VALUE: "foo",
        SHARED_NUMBER_VALUE: 42,
      },
    });

    expect(env).toStrictEqual({
      SHARED_STRING_VALUE: "foo",
      SHARED_NUMBER_VALUE: 42,
    });
  });

  it("should create mixed env", () => {
    const env = createEnv({
      publicPrefix: "PUBLIC_",
      privatePrefix: "PRIVATE_",
      schema: {
        public: {
          PUBLIC_STRING_VALUE: v.string(),
          PUBLIC_NUMBER_VALUE: v.number(),
        },
        private: {
          PRIVATE_STRING_VALUE: v.string(),
          PRIVATE_NUMBER_VALUE: v.number(),
        },
        shared: {
          SHARED_STRING_VALUE: v.string(),
          SHARED_NUMBER_VALUE: v.number(),
        },
      },
      values: {
        PUBLIC_STRING_VALUE: "foo",
        PUBLIC_NUMBER_VALUE: 42,
        PRIVATE_STRING_VALUE: "bar",
        PRIVATE_NUMBER_VALUE: 24,
        SHARED_STRING_VALUE: "baz",
        SHARED_NUMBER_VALUE: 12,
      },
    });

    expect(env).toStrictEqual({
      PUBLIC_STRING_VALUE: "foo",
      PUBLIC_NUMBER_VALUE: 42,
      PRIVATE_STRING_VALUE: "bar",
      PRIVATE_NUMBER_VALUE: 24,
      SHARED_STRING_VALUE: "baz",
      SHARED_NUMBER_VALUE: 12,
    });
  });

  it("should create mixed env but in public environment", () => {
    const env = createEnv({
      publicPrefix: "PUBLIC_",
      privatePrefix: "PRIVATE_",
      isPrivate: false,
      schema: {
        public: {
          PUBLIC_STRING_VALUE: v.string(),
          PUBLIC_NUMBER_VALUE: v.number(),
        },
        private: {
          PRIVATE_STRING_VALUE: v.string(),
          PRIVATE_NUMBER_VALUE: v.number(),
        },
        shared: {
          SHARED_STRING_VALUE: v.string(),
          SHARED_NUMBER_VALUE: v.number(),
        },
      },
      values: {
        PUBLIC_STRING_VALUE: "foo",
        PUBLIC_NUMBER_VALUE: 42,
        PRIVATE_STRING_VALUE: "bar",
        PRIVATE_NUMBER_VALUE: 24,
        SHARED_STRING_VALUE: "baz",
        SHARED_NUMBER_VALUE: 12,
      },
    });

    expect(env).toStrictEqual({
      PUBLIC_STRING_VALUE: "foo",
      PUBLIC_NUMBER_VALUE: 42,
      SHARED_STRING_VALUE: "baz",
      SHARED_NUMBER_VALUE: 12,
    });
  });

  it("can use any valibot schema", () => {
    const env = createEnv({
      schema: {
        shared: {
          NODE_ENV: v.union([
            v.literal("development"),
            v.literal("production"),
          ]),
          PORT: v.pipe(
            v.string(),
            v.transform((s) => Number(s)),
            v.integer(),
          ),
        },
      },
      values: {
        NODE_ENV: "development",
        PORT: "3000",
      },
    });

    expect(env).toStrictEqual({
      NODE_ENV: "development",
      PORT: 3000,
    });
  });

  it("should throw error when invalid value is provided", () => {
    expect(() => {
      createEnv({
        schema: {
          shared: {
            NODE_ENV: v.union([
              v.literal("development"),
              v.literal("production"),
            ]),
          },
        },
        values: {
          NODE_ENV: "invalid",
        },
      });
    }).toThrowError();
  });

  describe("test types", () => {
    it("should pass type check", () => {
      expect(() => {
        createEnv({
          publicPrefix: "PUBLIC_",
          privatePrefix: "PRIVATE_",
          schema: {
            private: {
              PRIVATE_VALUE_IN_PRIVATE: v.string(),
              // @ts-expect-error should not allow public value in private schema
              PUBLIC_VALUE_IN_PRIVATE: v.string(),
              // @ts-expect-error should not allow non-prefixed value
              WITHOUT_PREFIX_VALUE: v.string(),
            },
            public: {
              PUBLIC_VALUE_IN_PUBLIC: v.string(),
              // @ts-expect-error should not allow private value in public schema
              PRIVATE_VALUE_IN_PUBLIC: v.string(),
              // @ts-expect-error should not allow non-prefixed value
              WITHOUT_PREFIX_VALUE: v.string(),
            },
          },
          values: {},
        });
      });
    });
  });
});
