import linguiConfig from '@/../lingui.config'
import { LinguiClientProvider } from '@/components/lingui-client-provider'
import { allMessages, getI18nInstance } from '@/i18n/app-router-i18n'
import { PageLangParam, withLinguiLayout } from '@/i18n/with-lingui'
import { t } from '@lingui/macro'

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
 * Generates metadata for a given page based on the specified language
 * parameters.
 *
 * @param params.params
 * @param params - The parameters for the page.
 * @param params.lang - The language code to be used for translations.
 * @returns Metadata object including the translated title.
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
    <html lang={lang}>
      <body className="">
        <main className="flex min-h-screen flex-col">
          <LinguiClientProvider
            initialLocale={lang}
            initialMessages={allMessages[lang]!}
          >
            {children}
          </LinguiClientProvider>
        </main>
      </body>
    </html>
  )
})
