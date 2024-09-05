import { Layout } from '@/components'
import { useLanguageAndDirection } from '@/hooks/use-language-and-direction'
import { useLinguiInit } from '@/hooks/use-lingui-init'
import '@/styles/globals.css'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import type { AppProps } from 'next/app'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

const mainnetRpcUrl = process.env.NEXT_PUBLIC_MAINNET_RPC_URL
const sepoliaRpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL

const queryClient = new QueryClient()

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(mainnetRpcUrl),
    [sepolia.id]: http(sepoliaRpcUrl),
  },
})

export default function App({ Component, pageProps }: AppProps) {
  useLinguiInit(pageProps.translation)
  useLanguageAndDirection()

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <I18nProvider i18n={i18n}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </I18nProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
