import { Geist, Geist_Mono } from 'next/font/google'

import linguiConfig from '@/../lingui.config'
import { LinguiClientProvider } from '@/components/lingui-client-provider'
import { allMessages, getI18nInstance } from '@/i18n/app-router-i18n'
import { initLingui, PageLangParam } from '@/i18n/init-lingui'
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

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang) => ({ lang }))
}

export async function generateMetadata(props: PageLangParam) {
  const i18n = getI18nInstance((await props.params).lang)

  return {
    title: t(i18n)`Lil Nouns Auction`,
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const lang = (await params).lang
  initLingui(lang)

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
}
