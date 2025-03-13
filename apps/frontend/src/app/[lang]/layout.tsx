import { type ReactNode } from 'react'

import { Geist, Geist_Mono } from 'next/font/google'

import linguiConfig from '../../../lingui.config'
import { LinguiClientProvider } from '@/components/lingui-client-provider'
import { allMessages, getI18nInstance } from '@/i18n/app-router-i18n'
import { initLingui, PageLangParam } from '@/i18n/init-lingui'
import { t } from '@lingui/core/macro'

import '@repo/ui/globals.css'
import { Providers } from '@/components/providers'

import { cn } from '@repo/ui/lib/utils'
import { Toaster } from '@repo/ui/components/sonner'

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

  const appUrl = process.env.NEXT_PUBLIC_SITE_URL

  return {
    metadataBase: new URL(`${appUrl}`),
    title: t(i18n)`Lil Nouns Auction`,
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const lang = (await params).lang
  initLingui(lang)

  return (
    <html lang={lang} suppressHydrationWarning>
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
            <Providers>{children}</Providers>
          </LinguiClientProvider>
        </main>
        <Toaster />
      </body>
    </html>
  )
}
