import { FC } from "react";
import { env } from "../env";
import { GetStaticProps } from "next";

type Props = {
  env: typeof env;
};

export const getStaticProps: GetStaticProps<Props> = () => {
  return {
    props: {
      env,
    },
  };
};

const Page: FC<Props> = (props) => {
  return <pre>{JSON.stringify(props, null, 2)}</pre>;
};

export default Page;
