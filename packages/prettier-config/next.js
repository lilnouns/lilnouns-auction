import * as prettierPluginOrganizeAttributes from 'prettier-plugin-organize-attributes'
import * as prettierPluginOrganizeImports from 'prettier-plugin-organize-imports'
import * as prettierPluginPackageJson from 'prettier-plugin-packagejson'

import { config as baseConfig } from './base.js'

/**
 * A shared Prettier configuration for libraries that use Next.js.
 *
 * @type {import('prettier').Config}
 */
export const config = {
  ...baseConfig,
  plugins: [
    prettierPluginOrganizeImports,
    prettierPluginOrganizeAttributes,
    // prettierPluginTailwindcss,
    prettierPluginPackageJson,
  ],
  tailwindFunctions: ['clsx', 'cn'],
}
