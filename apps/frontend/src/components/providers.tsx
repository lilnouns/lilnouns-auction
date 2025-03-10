'use client'

import { type PropsWithChildren } from 'react'

// import { ErrorBoundary } from 'react-error-boundary'
// import ErrorFallback from '@/components/error-fallback'
import { ThemeProvider } from '@/components/theme-provider'
import { find, mapToObj, pipe } from 'remeda'
import { mainnet, sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, http, WagmiProvider } from 'wagmi'

import { farcasterFrame } from '@farcaster/frame-wagmi-connector'

import {
  coinbaseWallet,
  injected,
  metaMask,
  safe,
  walletConnect,
} from 'wagmi/connectors'

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
    coinbaseWallet({
      appName: `Lil Nouns Auction`,
    }),
    safe(),
    farcasterFrame(),
  ],
  transports,
})

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/*<ErrorBoundary FallbackComponent={ErrorFallback}>*/}
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
      {/*</ErrorBoundary>*/}
    </ThemeProvider>
  )
}
