import linguiConfig from '@/../lingui.config'
import ErrorFallback from '@/components/error-fallback'
import { LinguiClientProvider } from '@/components/lingui-client-provider'
import { allMessages, getI18nInstance } from '@/i18n/app-router-i18n'
import { initLingui, PageLangParam } from '@/i18n/init-lingui'
import { t } from '@lingui/macro'
import { ThemeModeScript } from 'flowbite-react'
import { ErrorBoundary } from 'react-error-boundary'
import React from 'react'

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang) => ({ lang }))
}

export async function generateMetadata(props: PageLangParam) {
  const i18n = getI18nInstance((await props.params).lang)

  return {
    title: t(i18n)`Translation Demo`,
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: any
}) {
  const lang = params.lang
  initLingui(lang)

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
}
