import { FC } from "react";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const env = createEnv({
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url(),
    NEXT_PUBLIC_SITE_NAME: z.string(),
  },
  server: {
    DUMMY_API_URL: z.string().url(),
    DUMMY_API_KEY: z.string(),
  },
  shared: {
    NODE_ENV: z.union([z.literal("development"), z.literal("production")]),
    VERCEL_ENV: z.union([
      z.literal("development"),
      z.literal("preview"),
      z.literal("production"),
    ]),
  },
  runtimeEnv: {
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
