# Guide

## Private Environment Variables

Specify the schema that private environment variables should satisfy in `schema.private`. If there is a rule that prefixes are required due to framework restrictions, you can specify `privatePrefix` to avoid forgetting to add the prefix.

```tsx
import { createEnv } from "valibot-env";
import * as v from "valibot";

export const env = createEnv({
  privatePrefix: "PRIVATE_",
  schema: {
    private: {
      PRIVATE_STRING_VALUE: v.string(),
      PRIVATE_NUMBER_VALUE: v.number(),
    },
  },
  values: process.env,
});
```

## Public Environment Variables

Specify the schema that public environment variables should satisfy in `schema.public`. If there is a rule that prefixes are required due to framework restrictions, you can specify `publicPrefix` to avoid forgetting to add the prefix.

```tsx
import { createEnv } from "valibot-env";
import * as v from "valibot";

export const env = createEnv({
  publicPrefix: "PUBLIC_",
  schema: {
    public: {
      PUBLIC_STRING_VALUE: v.string(),
      PUBLIC_NUMBER_VALUE: v.number(),
    },
  },
  values: process.env,
});
```

## Shared Environment Variables

Shared environment variables are accessible from both public and private environments but are not prefixed. For example, `NODE_ENV` and `VERCEL_ENV` are shared environment variables.

```tsx
import { createEnv } from "valibot-env";
import * as v from "valibot";

export const env = createEnv({
  schema: {
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
```

## Various Combinations of valibot

By combining different features of `valibot`, you can achieve various applications. For example, while `process.env` always contains `string` types, you might want to handle a port number as a `number` at runtime. In such cases, you can use `v.transform()` to convert the type from string to number.

```tsx
import { createEnv } from "valibot-env";
import * as v from "valibot";

export const env = createEnv({
  schema: {
    shared: {
      PORT: v.pipe(
        v.string(),
        v.transform((s) => Number(s)),
      ),
    },
  },
  values: process.env,
});
```

Additionally, you might want to specify the possible values for some environment variables as literals. In such cases, you can use `v.literal()` or `v.union()` to define the permissible values for the environment variables.

```tsx
import { createEnv } from "valibot-env";
import * as v from "valibot";

export const env = createEnv({
  schema: {
    shared: {
      NODE_ENV: v.union([v.literal("development"), v.literal("production")]),
    },
  },
  values: process.env,
});
```

These techniques can also be applied when using `createEnv` for specific frameworks.
