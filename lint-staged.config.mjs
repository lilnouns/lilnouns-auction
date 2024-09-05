import path from "node:path";

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

export default {
  // Run Next.js lint only on files in the Next.js app
  "apps/frontend/**/*.{js,jsx,ts,tsx}": [
    buildEslintCommand,
    "prettier --write",
  ],

  // Use general linting rules for other packages and files outside Next.js
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{md,mdx}": ["prettier --write"],
  "*.{json,yaml,yml}": ["prettier --write"],
};
