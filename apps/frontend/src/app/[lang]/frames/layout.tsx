import type { Metadata } from 'next'

import dynamic from 'next/dynamic'

const WagmiProvider = dynamic(() => import('@/components/wagmi-provider'), {
  ssr: false,
})

export const metadata: Metadata = {
  title: 'Farcaster Frames v2 Demo',
  description: 'A Farcaster Frames v2 demo app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider>{children}</WagmiProvider>
      </body>
    </html>
  )
}
