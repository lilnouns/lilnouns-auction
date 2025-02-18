import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import linguiConfig from '@/../lingui.config'
import { LinguiClientProvider } from '@/components/lingui-client-provider'
import { allMessages, getI18nInstance } from '@/i18n/app-router-i18n'
import { PageLangParam, withLinguiLayout } from '@/i18n/with-lingui'
import { t } from '@lingui/core/macro'

import ErrorFallback from '@/components/error-fallback'
import { ErrorBoundary } from 'react-error-boundary'

import { cn } from '@repo/ui/lib/utils'
import { Toaster } from '@repo/ui/components/toaster'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Lil Nouns Auction',
  description: '',
}

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
      <body
        className={cn(
          'min-h-svh bg-background font-sans antialiased',
          geistSans.variable,
          geistMono.variable,
        )}
        suppressHydrationWarning={true}
      >
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
        <Toaster />
      </body>
    </html>
  )
})
