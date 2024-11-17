import { buildSVG } from '@lilnounsdao/sdk'
import {
  ImageData,
  getNounData,
  getNounSeedFromBlockHash,
} from '@shared/utilities'
import { gql, request } from 'graphql-request'
import React, { useCallback, useEffect, useState } from 'react'
import { join, map, pipe, split } from 'remeda'
import { formatEther } from 'viem'
import { useWriteContract } from 'wagmi'

const { palette } = ImageData

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
  let subgraphUrl = process.env.NEXT_PUBLIC_ETHEREUM_BLOCKS_SUBGRAPH_URL

  if (!subgraphUrl) {
    throw new Error('Ethereum Blocks Subgraph URL is not configured')
  }

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

/**
 * Formats the given trait name by capitalizing each part of the name and
 * removing specific prefixes if present.
 *
 * @param traitName - The trait name to format.
 * @returns The formatted trait name.
 */
function formatTraitName(traitName: string): string {
  const prefixes = new Set(['head', 'accessory', 'glasses', 'body'])

  return pipe(
    traitName,
    split('-'),
    (parts) => (prefixes.has(parts[0] ?? '') ? parts.slice(1) : parts),
    map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : '')),
    join(' '),
  )
}

const SVGImage: React.FC<{ svgBase64: string }> = ({ svgBase64 }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={`data:image/svg+xml;base64,${svgBase64}`}
    alt="Noun SVG"
    className="w-full"
  />
)

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
    try {
      let blockOffset = 0
      let blockLimit = 256

      const filterParams: Partial<Seed> = {
        background:
          seedBackground && !Number.isNaN(Number(seedBackground))
            ? Number(seedBackground)
            : undefined,
        body:
          seedBody && !Number.isNaN(Number(seedBody))
            ? Number(seedBody)
            : undefined,
        accessory:
          seedAccessory && !Number.isNaN(Number(seedAccessory))
            ? Number(seedAccessory)
            : undefined,
        head:
          seedHead && !Number.isNaN(Number(seedHead))
            ? Number(seedHead)
            : undefined,
        glasses:
          seedGlasses && !Number.isNaN(Number(seedGlasses))
            ? Number(seedGlasses)
            : undefined,
      }

      let seedResults: SeedData[] = []
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

  const handleSearch = () => {
    fetchData()
  }

  const handleReset = () => {
    setSeedBackground('')
    setSeedBody('')
    setSeedAccessory('')
    setSeedHead('')
    setSeedGlasses('')
  }

  useEffect(() => {
    // Initial fetch on component mount
    fetchData()

    // Setting up interval for fetching data every 12 seconds
    const intervalId = setInterval(fetchData, 12_000)

    // Cleanup function
    return () => {
      clearInterval(intervalId)
    }
  }, [fetchData])

  const { writeContract } = useWriteContract()

  const handleBuy = (blockNumber: number) => {
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
      address: '0xA2587b1e2626904c8575640512b987Bd3d3B592D',
      functionName: 'buyNow',
      args: [BigInt(blockNumber), BigInt(nounId ?? 0)],
      value: price,
    })
  }

  // @ts-ignore
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between bg-gray-50 p-1 py-5 dark:bg-gray-900">
        <section className="w-full p-1">
          <div className="container mx-auto">
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 shadow-md dark:bg-gray-800">
                <select
                  value={seedBackground}
                  onChange={(e) => setSeedBackground(e.target.value)}
                  className="rounded border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-400"
                >
                  <option value="">Select Background</option>
                  {ImageData.bgcolors.map((color, index) => (
                    <option key={index} value={index.toString()}>
                      {color}
                    </option>
                  ))}
                </select>
                <select
                  value={seedBody}
                  onChange={(e) => setSeedBody(e.target.value)}
                  className="rounded border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-400"
                >
                  <option value="">Select Body</option>
                  {ImageData.images.bodies.map((body, index) => (
                    <option key={index} value={index.toString()}>
                      {formatTraitName(body.filename)}
                    </option>
                  ))}
                </select>
                <select
                  value={seedAccessory}
                  onChange={(e) => setSeedAccessory(e.target.value)}
                  className="rounded border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-400"
                >
                  <option value="">Select Accessory</option>
                  {ImageData.images.accessories.map((accessory, index) => (
                    <option key={index} value={index.toString()}>
                      {formatTraitName(accessory.filename)}
                    </option>
                  ))}
                </select>
                <select
                  value={seedHead}
                  onChange={(e) => setSeedHead(e.target.value)}
                  className="rounded border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-400"
                >
                  <option value="">Select Head</option>
                  {ImageData.images.heads.map((head, index) => (
                    <option key={index} value={index.toString()}>
                      {formatTraitName(head.filename)}
                    </option>
                  ))}
                </select>
                <select
                  value={seedGlasses}
                  onChange={(e) => setSeedGlasses(e.target.value)}
                  className="rounded border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-400"
                >
                  <option value="">Select Glasses</option>
                  {ImageData.images.glasses.map((glasses, index) => (
                    <option key={index} value={index.toString()}>
                      {formatTraitName(glasses.filename)}
                    </option>
                  ))}
                </select>
                {/*<input
                  type="number"
                  value={limit}
                  min={1}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  placeholder="Limit"
                  className="rounded border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-400"
                />*/}
                {/*<select
                  value={cache}
                  onChange={(e) => setCache(Number(e.target.value))}
                  className="rounded border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-400"
                >
                  <option value="">Select Glasses</option>
                  <option key={0} value={0}>
                    No Cache
                  </option>
                  <option key={1} value={1}>
                    Full Cache
                  </option>
                  <option key={2} value={2}>
                    Block Cache
                  </option>
                </select>*/}
                <span />
                <input
                  type="number"
                  value={Number(nounId)}
                  placeholder="Noun"
                  disabled={true}
                  className="rounded border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-400"
                />
                <input
                  type="number"
                  value={formatEther(BigInt(price ?? 0))}
                  readOnly={true}
                  placeholder="Price"
                  className="rounded border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-400"
                />
                {/*<button
                  onClick={handleSearch}
                  className="w-full rounded bg-green-50 py-2 text-sm font-semibold text-gray-900 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-green-800 dark:text-gray-200 dark:hover:bg-green-700"
                >
                  Search
                </button>
                <button
                  onClick={handleReset}
                  className="w-full rounded bg-green-50 py-2 text-sm font-semibold text-gray-900 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-green-800 dark:text-gray-200 dark:hover:bg-green-700"
                >
                  Reset
                </button>*/}
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
                    <div
                      key={blockNumber}
                      className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white p-0 text-center shadow dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="flex flex-1 flex-col items-center p-6">
                        <SVGImage svgBase64={renderSVG(seed)} />
                        <div className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                          Block Number: {blockNumber}
                        </div>
                      </div>
                      <div className="flex">
                        <button
                          onClick={() => handleBuy(blockNumber)}
                          className="relative inline-flex w-full justify-center rounded-b-lg border border-transparent bg-green-50 py-3 text-sm font-semibold text-gray-900 hover:bg-green-100 dark:bg-green-800 dark:text-gray-200 dark:hover:bg-green-700"
                        >
                          Buy Now
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
