import { formatter } from '@lingui/format-po'
import type { LinguiConfig } from '@lingui/conf'

const config: LinguiConfig = {
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

export default config
