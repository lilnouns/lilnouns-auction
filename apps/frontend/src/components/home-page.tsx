'use client'

import Navbar from '@/components/navbar'
import { UpdateBanner } from '@/components/update-banner'
import { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import Auction from '@/components/auction'
import { useNextNoun } from '@/hooks/use-next-noun'
import { Trans, useLingui } from '@lingui/react/macro'

import { sdk as frameSdk } from '@farcaster/frame-sdk'
import { useAsync, useMount, useUpdateEffect } from 'react-use'

export const HomePage: NextPage = () => {
  const { t } = useLingui()
  const [isClient, setIsClient] = useState(false)

  const { nounId } = useNextNoun()

  useAsync(async () => {
    if (typeof window === 'undefined') return
    frameSdk.actions.addFrame()
    await frameSdk.actions.ready()
  }, [])

  useUpdateEffect(() => {
    if (!nounId) return

    document.title = t`Noun ${nounId} | Lil Nouns Auction`

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        `Explore the seeds of Noun ${nounId}. Discover the power of decentralized creativity.`,
      )
    }
  }, [nounId, t])

  useMount(() => setIsClient(true))

  if (!isClient) return null

  return (
    <>
      <Head>
        <title>
          <Trans>Lil Nouns Auction</Trans>
        </title>
        <meta
          name="description"
          content={`Lil Nouns Auction: your chance to choose the perfect traits from a pool of 256 Lil Nouns!`}
        />
      </Head>

      <UpdateBanner />

      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Auction />
      </div>
    </>
  )
}
