import type { Metadata } from 'next'

import '@repo/ui/globals.css'
import { Providers } from '@/components/providers'

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
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
