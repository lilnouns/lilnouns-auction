'use client'

import Navbar from '@/components/navbar'
import { Banner } from '@/components/banner'
import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Auction from '@/components/auction'
import { useNextNoun } from '@/hooks/use-next-noun'
import { useLingui } from '@lingui/react/macro'

import { sdk as frameSdk } from '@farcaster/frame-sdk'

export const HomePage: NextPage = () => {
  const { t } = useLingui()
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
      document.title = t`Noun ${nounId} | Lil Nouns Auction`

      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute(
          'content',
          `Explore the seeds of Noun ${nounId}. Discover the power of decentralized creativity.`,
        )
      }
    }
  }, [nounId, t])

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return

  return (
    <>
      <Head>
        <title>{t`Lil Nouns Auction`}</title>
        <meta
          name="description"
          content={`Lil Nouns Auction: your chance to choose the perfect traits from a pool of 256 Lil Nouns!`}
        />
      </Head>

      <Banner
        title="🚨 Update Available"
        description={
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            {t`A new version is live. `}{' '}
            <button
              onClick={() => window.location.reload()}
              className="font-semibold underline"
            >
              {t`Reload`}
            </button>
            .
          </span>
        }
        onClose={() => console.log('Banner dismissed 😊')}
      />

      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Auction />
      </div>
    </>
  )
}
