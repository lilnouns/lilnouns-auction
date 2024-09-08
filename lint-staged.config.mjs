import path from 'node:path'

const buildEslintCommand = (filenames) => {
  const files = filenames
    .map((f) => `"${path.relative(process.cwd(), f)}"`)
    .join(' --file ')
  return `cd apps/frontend && next lint --fix --file ${files}`
}

export default {
  // Run Next.js lint only on files in the Next.js app
  'apps/frontend/**/*.{js,jsx,ts,tsx}': [
    buildEslintCommand,
    'prettier --write',
  ],

  // Use ESLint and Prettier only on apps (excluding frontend) and all packages
  'apps/!(frontend)/**/*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  'packages/**/*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],

  '*.{md,mdx}': ['prettier --write'],
  '*.{json,yaml,yml}': ['prettier --write'],
}
