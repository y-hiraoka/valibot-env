import { FC } from "react";
import { createEnv } from "valibot-env/nextjs";
import * as v from "valibot";

const env = createEnv({
  schema: {
    public: {
      NEXT_PUBLIC_SITE_URL: v.pipe(v.string(), v.url()),
      NEXT_PUBLIC_SITE_NAME: v.string(),
    },
    private: {
      DUMMY_API_URL: v.pipe(v.string(), v.url()),
      DUMMY_API_KEY: v.string(),
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
    DUMMY_API_URL: process.env.DUMMY_API_URL,
    DUMMY_API_KEY: process.env.DUMMY_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
  },
});

const Page: FC = () => {
  return <pre>{JSON.stringify(env, null, 2)}</pre>;
};

export default Page;
