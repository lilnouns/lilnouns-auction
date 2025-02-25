/**
 * @type {import('lint-staged').Configuration}
 **/
export default {
  // Format specific file types
  '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
  // Type check TypeScript files
  '*.{ts,tsx}': () => 'tsc --noEmit',
}
