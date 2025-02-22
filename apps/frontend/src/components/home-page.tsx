'use client'

import Navbar from '@/components/navbar'
import { t } from '@lingui/core/macro'
import { useLingui } from '@lingui/react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Auction from '@/components/auction'
import { useNextNoun } from '@/hooks/use-next-noun'

export const HomePage: NextPage = () => {
  const [isClient, setIsClient] = useState(false)

  const { i18n } = useLingui()

  const { nounId } = useNextNoun()

  useEffect(() => {
    if (nounId) {
      document.title = t(i18n)`Noun ${nounId} | Lil Nouns Auction`

      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute(
          'content',
          `Explore the seeds of Noun ${nounId}. Discover the power of decentralized creativity.`,
        )
      }
    }
  }, [nounId, i18n])

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return

  return (
    <>
      <Head>
        <title>{t(i18n)`Lil Nouns Auction`}</title>
        <meta
          name="description"
          content={`Lil Nouns Auction: your chance to choose the perfect traits from a pool of 256 Lil Nouns!`}
        />
      </Head>

      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Auction />
      </div>
    </>
  )
}
