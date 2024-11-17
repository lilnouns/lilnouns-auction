import { WalletOptions } from '@/components/wallet-options'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Address } from 'viem'
import { useAccount, useReadContract } from 'wagmi'

// Dynamically import Auction component
const Auction = dynamic(() => import('@/components/auction'), {
  suspense: true,
})

const auctionContract = {
  address: '0xA2587b1e2626904c8575640512b987Bd3d3B592D' as Address,
  abi: [
    {
      inputs: [],
      name: 'fetchNextNoun',
      outputs: [
        {
          internalType: 'uint256',
          name: 'nounId',
          type: 'uint256',
        },
        {
          components: [
            {
              internalType: 'uint48',
              name: 'background',
              type: 'uint48',
            },
            {
              internalType: 'uint48',
              name: 'body',
              type: 'uint48',
            },
            {
              internalType: 'uint48',
              name: 'accessory',
              type: 'uint48',
            },
            {
              internalType: 'uint48',
              name: 'head',
              type: 'uint48',
            },
            {
              internalType: 'uint48',
              name: 'glasses',
              type: 'uint48',
            },
          ],
          internalType: 'struct INounsSeeder.Seed',
          name: 'seed',
          type: 'tuple',
        },
        {
          internalType: 'string',
          name: 'svg',
          type: 'string',
        },
        {
          internalType: 'uint256',
          name: 'price',
          type: 'uint256',
        },
        {
          internalType: 'bytes32',
          name: 'hash',
          type: 'bytes32',
        },
        {
          internalType: 'uint256',
          name: 'blockNumber',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ] as const,
}

export const HomePage: NextPage = () => {
  const { i18n } = useLingui()

  const { isConnected } = useAccount()

  const [nounId, setNounId] = useState<bigint | undefined>()
  const [price, setPrice] = useState<bigint | undefined>()

  const { data, isLoading, isError, error } = useReadContract({
    ...auctionContract,
    functionName: 'fetchNextNoun',
  })

  useEffect(() => {
    if (!isLoading && !isError && data) {
      const newNounId = data[0]
      const newPrice = data[3]
      setNounId(newNounId)
      setPrice(BigInt(newPrice))
    }
  }, [data, isLoading, isError])

  useEffect(() => {
    if (nounId) {
      document.title = t(i18n)`Noun ${nounId} | Lil Nouns Pool`

      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute(
          'content',
          `Explore the seeds of Noun ${nounId}. Discover the power of decentralized creativity.`,
        )
      }
    }
  }, [nounId, i18n])

  return (
    <>
      <Head>
        <title>{t(i18n)`Lil Nouns Pool`}</title>
        <meta
          name="description"
          content={`This demo site showcases the seamless integration of these powerful tools.`}
        />
      </Head>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {isConnected ? (
          <>
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-gray-700 dark:text-gray-300">
                Loading...
              </div>
            ) : isError ? (
              <div className="text-red-600 dark:text-red-400">
                Error: {error.toString()}
              </div>
            ) : (
              <Auction nounId={nounId} price={price} />
            )}
          </>
        ) : (
          <>
            <div className="mt-3">
              <WalletOptions />
            </div>
          </>
        )}
      </div>
    </>
  )
}
