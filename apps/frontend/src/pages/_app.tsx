import { Layout } from '@/components'
import ErrorFallback from '@/components/error-fallback'
import { useLanguageAndDirection } from '@/hooks/use-language-and-direction'
import { useLinguiInit } from '@/i18n/pages-router-i18n'
import '@/styles/globals.css'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import type { AppProps } from 'next/app'
import { ErrorBoundary } from 'react-error-boundary'
import { find, mapToObj, pipe } from 'remeda'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const activeChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)
const reownProjectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ?? ''
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY

const activeChain =
  pipe(
    [mainnet, sepolia],
    find((chain) => chain.id === activeChainId),
  ) ?? sepolia

const queryClient = new QueryClient()

const chainNetworkMap: Record<number, string> = {
  [mainnet.id]: 'eth-mainnet',
  [sepolia.id]: 'eth-sepolia',
}

const transports = mapToObj([mainnet, sepolia], (chain) => [
  chain.id,
  http(
    `https://${chainNetworkMap[chain.id]}.g.alchemy.com/v2/${alchemyApiKey}`,
  ),
])

const config = createConfig({
  chains: [activeChain],
  connectors: [
    injected(),
    walletConnect({ projectId: reownProjectId }),
    metaMask(),
    safe(),
  ],
  transports,
})

export default function App({ Component, pageProps }: AppProps) {
  useLinguiInit(pageProps.translation)
  useLanguageAndDirection()

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <I18nProvider i18n={i18n}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </I18nProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  )
}
