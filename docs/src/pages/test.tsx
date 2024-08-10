import { FC } from "react";
import { env } from "../env";
import { InferGetStaticPropsType } from "next";

export const getStaticProps = async () => {
  return {
    props: env,
  };
};

const Page: FC<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  return <pre>{JSON.stringify(props, null, 2)}</pre>;
};

export default Page;
