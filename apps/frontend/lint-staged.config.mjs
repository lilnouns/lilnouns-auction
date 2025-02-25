import path from "node:path";

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand, 'prettier --write'],
  '*.{json,md}': ['prettier --write'],
  '*.{css,scss}': ['prettier --write'],
}
