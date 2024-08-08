import { FC } from "react";
import { env } from "../env";
import { InferGetStaticPropsType } from "next";

export const getStaticProps = async () => {
  return {
    props: {
      API_URL: env.API_URL,
      VERCEL_ENV: env.VERCEL_ENV,
    },
  };
};

const Page: FC<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  return <pre>{JSON.stringify(props, null, 2)}</pre>;
};

export default Page;
