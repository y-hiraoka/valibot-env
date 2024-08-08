/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
