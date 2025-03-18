import path from 'node:path'

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  '**/src/*.{js,jsx,ts,tsx}': [buildEslintCommand, 'prettier --write'],
  '**/src/*.{json,md}': ['prettier --write'],
  '**/src/*.{css,scss}': ['prettier --write'],
}
