import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import onlyWarn from 'eslint-plugin-only-warn'
import turboPlugin from 'eslint-plugin-turbo'
import tseslint from 'typescript-eslint'
import pluginPrettier from 'eslint-plugin-prettier'
import pluginRegexp from 'eslint-plugin-regexp'
import globals from 'globals'
import pluginUnicorn from 'eslint-plugin-unicorn'

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import('eslint').Linter.Config}
 */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ['dist/**'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      prettier: pluginPrettier,
    },
  },
  {
    plugins: { regexp: pluginRegexp },
  },
  {
    languageOptions: { globals: globals.builtin },
    plugins: { unicorn: pluginUnicorn },
  },
]
