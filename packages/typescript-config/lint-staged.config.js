/**
 * @type {import('lint-staged').Configuration}
 **/
export default {
  // Format specific file types
  "*.{js,jsx,ts,tsx}": ["prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"],
};
