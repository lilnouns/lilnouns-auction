'use client'

export const runtime = 'edge'

import dynamic from 'next/dynamic'

const Demo = dynamic(() => import('@/components/demo'), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col p-4">
      <Demo />
    </main>
  )
}
