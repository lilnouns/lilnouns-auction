import { getLocale, getLocaleDirection, Locale } from '@/utils/locales'
import { ThemeModeScript } from 'flowbite-react'
import { Head, Html, Main, NextScript } from 'next/document'
import { ParsedUrlQuery } from 'node:querystring'
import { DocumentProps } from 'postcss'

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
      <Head>
        <ThemeModeScript />
      </Head>
      <body className="bg-white text-gray-600 antialiased dark:bg-gray-900 dark:text-gray-400">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
