import '@repo/ui/globals.css'
import type { AppProps } from 'next/app'

import { Layout } from '@/components'
import { Providers } from '@/components/providers'

import { useLanguageAndDirection } from '@/hooks/use-language-and-direction'
import { useLinguiInit } from '@/i18n/pages-router-i18n'

export default function App({ Component, pageProps }: AppProps) {
  useLinguiInit(pageProps.translation)
  useLanguageAndDirection()

  return (
    <Providers>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Providers>
  )
}
