import * as prettierPluginPackageJson from "prettier-plugin-packagejson";
/**
 * A shared Prettier configuration for the repository.
 *
 * @type {import('prettier').Config}
 */
export const config = {
  semi: false,
  trailingComma: "all",
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  plugins: [prettierPluginPackageJson],
};
