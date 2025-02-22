import { detect, fromPath } from '@lingui/detect-locale'
import langs from 'langs'
import { ParsedUrlQuery } from 'node:querystring'
import linguiConfig from '../../lingui.config'

export type Locale = (typeof linguiConfig.locales)[number]

export const defaultLocale: Locale = linguiConfig.sourceLocale as Locale

export const availableLocales: Locale[] = linguiConfig.locales as Locale[]

export async function loadCatalog(locale: Locale): Promise<object> {
  try {
    const catalog = await import(
      `@lingui/loader!../locales/${locale}/messages.po`
    )
    return catalog.messages
  } catch (error) {
    console.error(`Could not load translations for locale ${locale}`, error)
    return {}
  }
}

export function getLocale(query?: ParsedUrlQuery): Locale {
  const isClient = globalThis.window !== undefined
  const localFromPath = isClient ? fromPath(0) : undefined
  const localeFromQuery = query?.locale

  const detectedLocale = detect(localFromPath, localeFromQuery)

  return detectedLocale || defaultLocale
}

export function getLocaleName(locale: Locale) {
  return langs.where(1, locale)!.local
}

export function getLocaleDirection(locale: Locale) {
  return ['ar', 'he', 'fa'].includes(locale) ? 'rtl' : 'ltr'
}
