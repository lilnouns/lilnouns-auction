'use client'

import Navbar from '@/components/navbar'
import { UpdateBanner } from '@/components/update-banner'
import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Auction from '@/components/auction'
import { useNextNoun } from '@/hooks/use-next-noun'
import { Trans } from '@lingui/react/macro'
import { t } from '@lingui/core/macro'

import { sdk as frameSdk } from '@farcaster/frame-sdk'

export const HomePage: NextPage = () => {
  const [isClient, setIsClient] = useState(false)
  const [isFrameSDKLoaded, setIsFrameSDKLoaded] = useState(false)

  const { nounId } = useNextNoun()

  useEffect(() => {
    const load = async () => {
      frameSdk.actions.ready()
    }
    if (frameSdk && !isFrameSDKLoaded) {
      setIsFrameSDKLoaded(true)
      frameSdk.actions.addFrame()
      load()
    }
  }, [isFrameSDKLoaded])

  useEffect(() => {
    if (nounId) {
      document.title = t`Noun ${nounId.toString()} | Lil Nouns Auction`

      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute(
          'content',
          `Explore the seeds of Noun ${nounId}. Discover the power of decentralized creativity.`,
        )
      }
    }
  }, [nounId])

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return

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
