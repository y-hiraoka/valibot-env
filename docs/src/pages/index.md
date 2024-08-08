# valibot-env

valibot-env is a tool for creating type-safe environment variables in your project. It is powered by [valibot](https://valibot.dev) and inspired by [@t3-oss/t3-env](https://env.t3.gg/)

This library is framework-agnostic but provides a helper function for:

- [Next.js](https://nextjs.org/)

## Installation

To install valibot-env, run the following command:

```bash
npm install valibot-env
```

## Usage

### framework-agnostic

In any project, you can use `createEnv` from `"valibot-env"` to create a type-safe environment variable object.

```tsx
import { createEnv } from "valibot-env";
import * as v from "valibot";

export const env = createEnv({
  publicPrefix: "PUBLIC_",
  schema: {
    public: {
      PUBLIC_SITE_URL: v.pipe(v.string(), v.url()),
      PUBLIC_SITE_NAME: v.string(),
    },
    private: {
      API_URL: v.pipe(v.string(), v.url()),
      API_KEY: v.string(),
    },
    shared: {
      NODE_ENV: v.union([v.literal("development"), v.literal("production")]),
      VERCEL_ENV: v.union([
        v.literal("development"),
        v.literal("preview"),
        v.literal("production"),
      ]),
    },
  },
  values: process.env,
});

env.PUBLIC_SITE_URL; // access type-safely
env.VERRCEL_ENV; // compile error!
```

### For Next.js

We provide a helper function specifically for Next.js projects.

For projects using Next.js, use the `createEnv` function from `valibot-env/nextjs`.

```ts
import { createEnv } from "valibot-env/nextjs";
```

This function pre-defines `NEXT_PUBLIC_` as the prefix for public environment variables. Additionally, since Next.js only bundles the environment variables that are used in the source code, developers must specify these variables individually to ensure they are included at build time.

```tsx
import { createEnv } from "valibot-env/nextjs";
import * as v from "valibot";

export const env = createEnv({
  schema: {
    public: {
      NEXT_PUBLIC_SITE_URL: v.pipe(v.string(), v.url()),
      NEXT_PUBLIC_SITE_NAME: v.string(),
    },
    private: {
      API_URL: v.pipe(v.string(), v.url()),
      API_KEY: v.string(),
    },
    shared: {
      NODE_ENV: v.union([v.literal("development"), v.literal("production")]),
      VERCEL_ENV: v.union([
        v.literal("development"),
        v.literal("preview"),
        v.literal("production"),
      ]),
    },
  },
  values: {
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    API_URL: process.env.API_URL,
    API_KEY: process.env.API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
  },
});
```

## LICENSE

MIT
