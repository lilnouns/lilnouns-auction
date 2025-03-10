import { formatter } from '@lingui/format-po'
import type { LinguiConfig } from '@lingui/conf'

const config: LinguiConfig = {
  locales: [
    'ar',
    'cn',
    'de',
    'en',
    'es',
    'fa',
    'fr',
    'hi',
    'id',
    'it',
    'ja',
    'ko',
    'pseudo',
    'pt',
    'ru',
    'tr',
  ],
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
