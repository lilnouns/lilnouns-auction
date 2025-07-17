'use client'

import { type PropsWithChildren } from 'react'

// import { ErrorBoundary } from 'react-error-boundary'
// import ErrorFallback from '@/components/error-fallback'
import { ThemeProvider } from '@/components/theme-provider'
import { find, mapToObj, pipe } from 'remeda'
import { mainnet, sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, fallback, http, WagmiProvider } from 'wagmi'

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
const ankrApiKey = process.env.NEXT_PUBLIC_ANKR_API_KEY
// const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY

const activeChain =
  pipe(
    [mainnet, sepolia],
    find((chain) => chain.id === activeChainId),
  ) ?? sepolia

const queryClient = new QueryClient()

const alchemyNetworkMap: Record<number, string> = {
  [mainnet.id]: 'eth-mainnet',
  [sepolia.id]: 'eth-sepolia',
}

// const infuraNetworkMap: Record<number, string> = {
//   [mainnet.id]: 'mainnet',
//   [sepolia.id]: 'sepolia',
// }

const ankrNetworkMap: Record<number, string> = {
  [mainnet.id]: 'eth',
  [sepolia.id]: 'eth_sepolia',
}

const transports = mapToObj([mainnet, sepolia], (chain) => [
  chain.id,
  fallback([
    // webSocket(
    //   `wss://${alchemyNetworkMap[chain.id]}.g.alchemy.com/v2/${alchemyApiKey}`,
    // ),
    // // Infura WebSocket fallback
    // webSocket(
    //   `wss://${infuraNetworkMap[chain.id]}.infura.io/ws/v3/${infuraApiKey}`,
    // ),
    http(
      `https://${alchemyNetworkMap[chain.id]}.g.alchemy.com/v2/${alchemyApiKey}`,
    ),
    // Ankr HTTP fallback with private endpoint
    http(`https://rpc.ankr.com/${ankrNetworkMap[chain.id]}/${ankrApiKey}`),
  ]),
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
