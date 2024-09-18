import 'server-only'

import linguiConfig from '@/../lingui.config'
import { I18n, Messages, setupI18n } from '@lingui/core'
import { mapToObj } from 'remeda'

const { locales } = linguiConfig
type SupportedLocales = string

/**
 * Loads the message catalog for the specified locale.
 *
 * @param locale - The locale for which to load the message catalog.
 * @returns A promise that resolves to a tuple containing the locale and the
 *   loaded messages.
 */
async function loadCatalog(
  locale: SupportedLocales,
): Promise<[SupportedLocales, Messages]> {
  const { messages } = await import(`../locales/${locale}/messages.po`)
  return [locale, messages]
}

const catalogs = await Promise.all(
  locales.map((element) => loadCatalog(element)),
)

// Transform array of [locale, messages] tuples into an object
export const allMessages = mapToObj(catalogs, ([locale, messages]) => [
  locale,
  messages,
])

type AllI18nInstances = { [K in SupportedLocales]: I18n }

export const allI18nInstances: AllI18nInstances = mapToObj(
  locales,
  (locale) => {
    const i18n = setupI18n({
      locale,
      messages: { [locale]: allMessages[locale] ?? {} },
    })
    return [locale, i18n]
  },
)

export const getI18nInstance = (locale: SupportedLocales): I18n => {
  if (!allI18nInstances[locale]) {
    console.warn(`No i18n instance found for locale "${locale}"`)
  }
  return allI18nInstances[locale]! || allI18nInstances['en']!
}
