import * as prettierPluginOrganizeAttributes from "prettier-plugin-organize-attributes";
import * as prettierPluginOrganizeImports from "prettier-plugin-organize-imports";

import { config as baseConfig } from "./base.js";

/**
 * A shared Prettier configuration for libraries that use Next.js.
 *
 * @type {import('prettier').Config}
 */
export const config = {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    prettierPluginOrganizeImports,
    prettierPluginOrganizeAttributes,
    // prettierPluginTailwindcss,
  ],
  tailwindFunctions: ["clsx", "cn"],
};
