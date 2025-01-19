import linguiConfig from '@/../lingui.config'
import ErrorFallback from '@/components/error-fallback'
import { LinguiClientProvider } from '@/components/lingui-client-provider'
import { allMessages, getI18nInstance } from '@/i18n/app-router-i18n'
import { PageLangParam, withLinguiLayout } from '@/i18n/with-lingui'
import { t } from '@lingui/macro'
import { ThemeModeScript } from 'flowbite-react'
import { ErrorBoundary } from 'react-error-boundary'

/**
 * Generates an array of parameter objects for static site generation, where
 * each object contains a language code.
 *
 * @returns A promise that resolves to an array of objects, each with a 'lang'
 *   property.
 */
export async function generateStaticParams() {
  return linguiConfig.locales.map((lang) => ({ lang }))
}

/**
 * Generates metadata for a page based on the provided language parameters.
 *
 * @param params.params
 * @param params - The parameters object.
 * @param params.lang - The language code to be used for translation.
 * @returns An object containing the translated title for the page.
 */
export function generateMetadata({ params }: PageLangParam) {
  const i18n = getI18nInstance(params.lang)

  return {
    title: t(i18n)`Translation Demo`,
  }
}

export default withLinguiLayout(function RootLayout({
  children,
  params: { lang },
}) {
  return (
    <html lang={lang} className="dark">
      <head>
        <ThemeModeScript />
      </head>
      <body className="antialiased dark:bg-gray-900">
        <main className="flex min-h-screen flex-col">
          <LinguiClientProvider
            initialLocale={lang}
            initialMessages={allMessages[lang]!}
          >
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              {children}
            </ErrorBoundary>
          </LinguiClientProvider>
        </main>
      </body>
    </html>
  )
})
