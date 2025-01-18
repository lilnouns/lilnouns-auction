import AuctionListbox from '@/components/auction-combobox'
import { buildSVG } from '@lilnounsdao/sdk'
import {
  ImageData,
  getNounData,
  getNounSeedFromBlockHash,
} from '@shared/utilities'
import { gql, request } from 'graphql-request'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { useIdle } from 'react-use'
import { prop } from 'remeda'
import { Address, formatEther } from 'viem'
import { useWriteContract } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

const { palette } = ImageData

const activeChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)
const activeChainContracts: Record<number, Address> = {
  [mainnet.id]: '0xA2587b1e2626904c8575640512b987Bd3d3B592D',
  [sepolia.id]: '0x0d8c4d18765AB8808ab6CEE4d7A760e8b93AB20c',
}

interface BlockData {
  blocks?: Block[]
}

export interface Block {
  id: string
  number: number
  timestamp: number
  parentHash?: string
  author?: string
  difficulty: bigint
  totalDifficulty: bigint
  gasUsed: bigint
  gasLimit: bigint
  receiptsRoot: string
  transactionsRoot: string
  stateRoot: string
  size: bigint
  unclesHash: string
}

interface Seed {
  accessory: number
  background: number
  body: number
  glasses: number
  head: number
}

interface SeedData {
  blockNumber: number
  seed: Seed
}

export async function fetchBlocks(
  offset: number,
  limit: number,
  after?: number,
  before?: number,
): Promise<Block[]> {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? globalThis.location.origin
  let subgraphUrl = `${siteUrl}/subgraphs/blocks`

  const query = gql`
    query GetBlocks($skip: Int!, $first: Int!, $filter: Block_filter) {
      blocks(
        skip: $skip
        first: $first
        orderBy: number
        orderDirection: desc
        where: $filter
      ) {
        id
        number
        timestamp
        parentHash
        author
        difficulty
        totalDifficulty
        gasUsed
        gasLimit
        receiptsRoot
        transactionsRoot
        stateRoot
        size
        unclesHash
      }
    }
  `

  const filter: Record<string, unknown> = {}
  if (after !== null) filter.number_gt = after
  if (before !== null) filter.number_lt = before

  const variables = {
    skip: offset,
    first: limit,
    filter,
  }

  const { blocks } = await request<BlockData>(subgraphUrl, query, variables)

  return blocks ?? []
}

const SkeletonCard: React.FC = () => (
  <div className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white p-0 text-center shadow dark:border-gray-700 dark:bg-gray-800">
    <div className="flex flex-1 animate-pulse flex-col items-center p-6">
      <div className="size-24 w-full rounded bg-gray-300 dark:bg-gray-700"></div>
      <div className="mt-4 h-4 w-full rounded bg-gray-300 dark:bg-gray-700"></div>
    </div>
    <div className="flex">
      <div className="h-10 w-full rounded-b-lg bg-green-50 dark:bg-green-800"></div>
    </div>
  </div>
)

interface AuctionProps {
  nounId?: bigint | undefined
  price?: bigint | undefined
}

const Auction: React.FC<AuctionProps> = ({ nounId, price }) => {
  // Detect if user is idle. Idle threshold set to 10 minutes (600000 ms).
  const isIdle = useIdle(600_000)

  const [seedsData, setSeedsData] = useState<SeedData[]>([])
  const [error, setError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [seedBackground, setSeedBackground] = useState<string | undefined>()
  const [seedBody, setSeedBody] = useState<string | undefined>()
  const [seedAccessory, setSeedAccessory] = useState<string | undefined>()
  const [seedHead, setSeedHead] = useState<string | undefined>()
  const [seedGlasses, setSeedGlasses] = useState<string | undefined>()

  const renderSVG = useCallback((seed: Seed) => {
    const { parts, background } = getNounData(seed)
    const svgBinary = buildSVG(parts, palette, background)
    return btoa(svgBinary)
  }, [])

  const fetchData = useCallback(async () => {
    if (!nounId) return
    setIsLoading(false)

    let blockOffset = 0
    let blockLimit = 256

    const parseSeedParameter = (seedParam?: string): number | undefined =>
      seedParam && !Number.isNaN(Number(seedParam))
        ? Number(seedParam)
        : undefined

    const filterParams: Partial<Seed> = {
      background: parseSeedParameter(seedBackground),
      body: parseSeedParameter(seedBody),
      accessory: parseSeedParameter(seedAccessory),
      head: parseSeedParameter(seedHead),
      glasses: parseSeedParameter(seedGlasses),
    }

    let seedResults: SeedData[] = []

    try {
      const blocks = await fetchBlocks(blockOffset, blockLimit)
      const newSeedResults = await Promise.all(
        blocks.map(async (block) => {
          try {
            const seed = getNounSeedFromBlockHash(Number(nounId), block.id)
            const isMatching = Object.entries(filterParams).every(
              ([key, value]) =>
                value === undefined || seed[key as keyof Seed] === value,
            )
            return isMatching
              ? { blockNumber: block.number, seed }
              : { blockNumber: block.number, seed: undefined }
          } catch (error) {
            if (error instanceof Error) {
              console.error(
                `Error generating seed for block ${block.id}:`,
                error.message,
              )
            } else {
              console.error(
                `An unknown error occurred while generating seed for block ${block.id}:`,
                error,
              )
            }
            return { blockNumber: block.number, seed: undefined }
          }
        }),
      )

      seedResults = [
        ...seedResults,
        ...newSeedResults.filter(
          (result): result is SeedData => result.seed !== undefined,
        ),
      ]

      setSeedsData(seedResults)
    } catch (error_) {
      if (error_ instanceof Error) {
        setError(error_.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }, [nounId, seedBackground, seedBody, seedAccessory, seedHead, seedGlasses])

  useEffect(() => {
    // Initial fetch on component mount
    fetchData()

    // Declaring intervalId to use in cleanup and visibility/idleness checking
    let intervalId: NodeJS.Timeout | null

    // Setting up interval for fetching data every 12 seconds
    if (!isIdle) {
      intervalId = setInterval(fetchData, 12_000)
    }
    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [fetchData, isIdle])

  const router = useRouter()
  const { writeContract } = useWriteContract({
    mutation: {
      onSuccess: () => router.reload(),
    },
  })

  const handleBuy = (blockNumber: number) => {
    const args: readonly [bigint, bigint] = [
      BigInt(blockNumber),
      BigInt(nounId ?? 0),
    ]
    const value = price

    writeContract({
      abi: [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'expectedBlockNumber',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'expectedNounId',
              type: 'uint256',
            },
          ],
          name: 'buyNow',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
      ] as const,
      address:
        prop(activeChainContracts, activeChainId) ??
        activeChainContracts[sepolia.id],
      functionName: 'buyNow',
      args,
      value,
    })
  }

  // @ts-ignore
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between p-1 py-5">
        <section className="w-full p-1">
          <div className="container mx-auto">
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 shadow-md dark:bg-gray-800">
                <AuctionListbox
                  items={ImageData.bgcolors}
                  label="Choose a background"
                  onChange={(_, index) => setSeedBackground(index?.toString())}
                  placeholder="Search backgrounds..."
                />
                <AuctionListbox
                  items={ImageData.images.bodies}
                  label="Choose a body"
                  onChange={(_, index) => setSeedBody(index?.toString())}
                  placeholder="Search bodies..."
                />
                <AuctionListbox
                  items={ImageData.images.accessories}
                  label="Choose an accessory"
                  onChange={(_, index) => setSeedAccessory(index?.toString())}
                  placeholder="Search accessories..."
                />
                <AuctionListbox
                  items={ImageData.images.heads}
                  label="Choose a head"
                  onChange={(_, index) => setSeedHead(index?.toString())}
                  placeholder="Search heads..."
                />
                <AuctionListbox
                  items={ImageData.images.glasses}
                  label="Choose a glasses"
                  onChange={(_, index) => setSeedGlasses(index?.toString())}
                  placeholder="Search glasses..."
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="noun-id"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Noun ID
                    </label>
                    <div className="mt-2">
                      <input
                        id="noun-id"
                        name="noun-id"
                        type="number"
                        value={Number(nounId)}
                        placeholder="Noun"
                        disabled={true}
                        className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Price
                    </label>
                    <div className="mt-2">
                      <input
                        id="price"
                        name="price"
                        type="number"
                        value={formatEther(BigInt(price ?? 0))}
                        placeholder="Noun"
                        disabled={true}
                        className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {isLoading ? (
                <div className="grid grid-cols-1 gap-6 text-gray-900 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 dark:text-gray-200">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </div>
              ) : error ? (
                <div className="text-red-600 dark:text-red-400">
                  Error: {error}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 text-gray-900 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 dark:text-gray-200">
                  {seedsData.map(({ blockNumber, seed }) => (
                    <div className="group relative" key={blockNumber}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`data:image/svg+xml;base64,${renderSVG(seed)}`}
                        alt={`Noun ${nounId}`}
                        className="h-auto w-full rounded-lg shadow-md"
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => handleBuy(blockNumber)}
                          className="rounded-lg bg-white px-6 py-2 font-semibold text-black shadow hover:bg-gray-200"
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Auction
