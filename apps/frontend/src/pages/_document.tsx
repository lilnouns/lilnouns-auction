import { getLocale, getLocaleDirection, Locale } from '@/utils/locales'
import { Head, Html, Main, NextScript } from 'next/document'
import { ParsedUrlQuery } from 'node:querystring'
import { DocumentProps } from 'postcss'

import { cn } from '@repo/ui/lib/utils'
import { Toaster } from '@repo/ui/components/toaster'

type Props = DocumentProps & { __NEXT_DATA__: { query: ParsedUrlQuery } }

export default function Document(props: Props) {
  const { __NEXT_DATA__: nextData } = props
  const locale = getLocale(nextData.query)

  const language = locale as Locale
  const direction = getLocaleDirection(language)

  return (
    <Html
      suppressHydrationWarning
      lang={language}
      dir={direction}
      className="dark font-sans"
    >
      <Head />
      <body className={cn('min-h-svh bg-background font-sans antialiased')}>
        <Main />
        <NextScript />
        <Toaster />
      </body>
    </Html>
  )
}
