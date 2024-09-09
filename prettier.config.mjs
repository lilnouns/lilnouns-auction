/** @type {import('prettier').Config} */
export default {
  semi: false,
  trailingComma: 'all',
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  plugins: [
    'prettier-plugin-organize-imports',
    'prettier-plugin-organize-attributes',
    'prettier-plugin-jsdoc',
    'prettier-plugin-tailwindcss',
    'prettier-plugin-prisma',
    'prettier-plugin-toml',
  ],
  tailwindFunctions: ['clsx', 'clsxm'],
}
