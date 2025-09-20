import { useLocale } from '@/hooks/use-locale'
import { getLocaleDirection } from '@/utils/locales'
import { useIsomorphicLayoutEffect } from 'react-use'

const updateDocumentAttributes = (language: string, direction: string) => {
  document.documentElement.lang = language
  document.documentElement.dir = direction
}

export function useLanguageAndDirection(): void {
  const locale = useLocale()

  useIsomorphicLayoutEffect(() => {
    const direction = getLocaleDirection(locale)
    updateDocumentAttributes(locale, direction)
  }, [locale])
}
