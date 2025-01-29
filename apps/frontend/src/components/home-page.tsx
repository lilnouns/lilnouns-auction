import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useEffect, useState } from 'react'
// import { useErrorBoundary } from 'react-error-boundary'
import { WalletOptions } from '@/components/wallet-options'
import { Button, DarkThemeToggle, Flowbite, Navbar } from 'flowbite-react'
import Link from 'next/link'
import { prop } from 'remeda'
import { Address } from 'viem'
import { useAccount, useReadContract } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

// Dynamically import Auction component
const Auction = dynamic(() => import('@/components/auction'), {
  ssr: false,
  suspense: true,
})

const activeChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)
const activeChainContracts: Record<number, Address> = {
  [mainnet.id]: '0xA2587b1e2626904c8575640512b987Bd3d3B592D',
  [sepolia.id]: '0x0d8c4d18765AB8808ab6CEE4d7A760e8b93AB20c',
}

const auctionContract = {
  address:
    prop(activeChainContracts, activeChainId) ??
    activeChainContracts[sepolia.id],
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

const Noggles = () => (
  <svg
    aria-label={t`Lil Nouns Auction`} // Using aria-label instead
    className="mr-3 h-5"
    fill="none"
    shape-rendering="crispEdges"
    viewBox="0 0 20 8"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <path fill="#F3322C" d="M11 0H3v1h8zm9 0h-8v1h8zM4 1H3v1h1z" />
      <path fill="#FFF" d="M6 1H4v1h2z" />
      <path fill="#000" d="M10 1H6v1h4z" />
      <path fill="#F3322C" d="M11 1h-1v1h1zm2 0h-1v1h1z" />
      <path fill="#FFF" d="M15 1h-2v1h2z" />
      <path fill="#000" d="M19 1h-4v1h4z" />
      <path fill="#F3322C" d="M20 1h-1v1h1zM4 2H3v1h1z" />
      <path fill="#FFF" d="M6 2H4v1h2z" />
      <path fill="#000" d="M10 2H6v1h4z" />
      <path fill="#F3322C" d="M11 2h-1v1h1zm2 0h-1v1h1z" />
      <path fill="#FFF" d="M15 2h-2v1h2z" />
      <path fill="#000" d="M19 2h-4v1h4z" />
      <path fill="#F3322C" d="M20 2h-1v1h1zM4 3H0v1h4z" />
      <path fill="#FFF" d="M6 3H4v1h2z" />
      <path fill="#000" d="M10 3H6v1h4z" />
      <path fill="#F3322C" d="M13 3h-3v1h3z" />
      <path fill="#FFF" d="M15 3h-2v1h2z" />
      <path fill="#000" d="M19 3h-4v1h4z" />
      <path fill="#F3322C" d="M20 3h-1v1h1zM1 4H0v1h1zm3 0H3v1h1z" />
      <path fill="#FFF" d="M6 4H4v1h2z" />
      <path fill="#000" d="M10 4H6v1h4z" />
      <path fill="#F3322C" d="M11 4h-1v1h1zm2 0h-1v1h1z" />
      <path fill="#FFF" d="M15 4h-2v1h2z" />
      <path fill="#000" d="M19 4h-4v1h4z" />
      <path fill="#F3322C" d="M20 4h-1v1h1zM1 5H0v1h1zm3 0H3v1h1z" />
      <path fill="#FFF" d="M6 5H4v1h2z" />
      <path fill="#000" d="M10 5H6v1h4z" />
      <path fill="#F3322C" d="M11 5h-1v1h1zm2 0h-1v1h1z" />
      <path fill="#FFF" d="M15 5h-2v1h2z" />
      <path fill="#000" d="M19 5h-4v1h4z" />
      <path fill="#F3322C" d="M20 5h-1v1h1zM4 6H3v1h1z" />
      <path fill="#FFF" d="M6 6H4v1h2z" />
      <path fill="#000" d="M10 6H6v1h4z" />
      <path fill="#F3322C" d="M11 6h-1v1h1zm2 0h-1v1h1z" />
      <path fill="#FFF" d="M15 6h-2v1h2z" />
      <path fill="#000" d="M19 6h-4v1h4z" />
      <path fill="#F3322C" d="M20 6h-1v1h1zm-9 1H3v1h8zm9 0h-8v1h8z" />
    </g>
  </svg>
)

export const HomePage: NextPage = () => {
  const [isClient, setIsClient] = useState(false)

  const { i18n } = useLingui()

  const [nounId, setNounId] = useState<bigint | undefined>()
  const [price, setPrice] = useState<bigint | undefined>()

  const { isConnecting } = useAccount()

  const [isModalOpen, setIsModalOpen] = useState(false)

  // const { showBoundary } = useErrorBoundary()

  const { data, isLoading, isError, error } = useReadContract({
    ...auctionContract,
    functionName: 'fetchNextNoun',
  })

  // useEffect(() => {
  //   if (isError) {
  //     showBoundary(error)
  //   }
  // }, [error, isError, showBoundary])

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

      <Navbar
        rounded
        className="border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800"
      >
        <Navbar.Brand as={Link} href="/">
          <Noggles />
          <span className="hidden self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            {t`Lil Nouns Auction`}
          </span>
        </Navbar.Brand>
        <div className="flex gap-2 sm:justify-start md:order-2">
          <Flowbite>
            <DarkThemeToggle />
          </Flowbite>
          <Button
            onClick={() => setIsModalOpen(true)}
            isProcessing={isConnecting}
            color="light"
          >
            Connect wallet
          </Button>
        </div>
      </Navbar>

      <WalletOptions
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Auction nounId={nounId} price={price} />
    </>
  )
}
