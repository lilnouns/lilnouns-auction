const { formatter } = require('@lingui/format-po')

/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['ar', 'en', 'fa', 'tr', 'pseudo'],
  pseudoLocale: 'pseudo',
  sourceLocale: 'en',
  fallbackLocales: {
    default: 'en',
  },
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['<rootDir>/src'],
      exclude: ['**/node_modules/**', '**/.next/**', '**/out/**'],
    },
  ],
  format: formatter({ lineNumbers: false }),
}
