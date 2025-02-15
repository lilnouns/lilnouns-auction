import Navbar from '@/components/navbar'
import { WalletOptions } from '@/components/wallet-options'
import { t } from '@lingui/core/macro'
import { useLingui } from '@lingui/react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { useAccount } from 'wagmi'
import Auction from '@/components/auction'
import { useNextNoun } from '@/hooks/use-next-noun'

export const HomePage: NextPage = () => {
  const [isClient, setIsClient] = useState(false)

  const { i18n } = useLingui()

  const { isConnected } = useAccount()
  const { nounId, price, isLoading } = useNextNoun()

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
        {isConnected ? (
          <>
            {isLoading ? (
              <div className="mt-6 flex h-full items-center justify-center text-gray-700 dark:text-gray-300">
                <BeatLoader color={'#18181b'} loading={isLoading} size={15} />
              </div>
            ) : (
              <Auction nounId={nounId} price={price} />
            )}
          </>
        ) : (
          <>
            <div className="mx-auto mt-10 max-w-sm">
              <WalletOptions />
            </div>
          </>
        )}
      </div>
    </>
  )
}
