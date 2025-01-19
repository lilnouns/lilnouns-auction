import { Layout } from '@/components'
import ErrorFallback from '@/components/error-fallback'
import { useLanguageAndDirection } from '@/hooks/use-language-and-direction'
import { useLinguiInit } from '@/i18n/pages-router-i18n'
import '@/styles/globals.css'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { ErrorBoundary } from 'react-error-boundary'

const WagmiProvider = dynamic(() => import('@/components/wagmi-provider'), {
  ssr: false,
})

export default function App({ Component, pageProps }: AppProps) {
  useLinguiInit(pageProps.translation)
  useLanguageAndDirection()

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <WagmiProvider>
        <I18nProvider i18n={i18n}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </I18nProvider>
      </WagmiProvider>
    </ErrorBoundary>
  )
}
