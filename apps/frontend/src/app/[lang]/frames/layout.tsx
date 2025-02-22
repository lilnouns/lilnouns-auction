import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import '@repo/ui/globals.css'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'Farcaster Frames v2 Demo',
  description: 'A Farcaster Frames v2 demo app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
