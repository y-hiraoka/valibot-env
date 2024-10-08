import { DocsThemeConfig } from "nextra-theme-docs";

export default {
  logo: <b>valibot-env</b>,
  project: {
    link: "https://github.com/y-hiraoka/valibot-env",
  },
  footer: { text: "MIT © y-hiraoka" },
  useNextSeoProps() {
    return {
      title: "valibot-env",
      titleTemplate: "%s | valibot-env",
    };
  },
} satisfies DocsThemeConfig;
