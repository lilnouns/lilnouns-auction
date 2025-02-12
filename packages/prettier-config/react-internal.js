import prettierPluginOrganizeAttributes from 'prettier-plugin-organize-attributes'
import prettierPluginOrganizeImports from 'prettier-plugin-organize-imports'
import prettierPluginPackageJson from 'prettier-plugin-packagejson'
import prettierPluginPrisma from 'prettier-plugin-prisma'

import { config as baseConfig } from './base.js'

/**
 * A shared Prettier configuration for libraries that use React.
 *
 * @type {import('prettier').Config}
 */
export const config = {
  ...baseConfig,
  plugins: [
    prettierPluginOrganizeImports,
    prettierPluginOrganizeAttributes,
    prettierPluginPrisma,
    prettierPluginPackageJson,
  ],
  tailwindFunctions: ['clsx', 'cn'],
}
