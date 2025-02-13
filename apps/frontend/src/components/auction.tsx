'use client'

import { buildSVG } from '@lilnounsdao/sdk'
import { t } from '@lingui/core/macro'
import {
  ImageData,
  getNounData,
  getNounSeedFromBlockHash,
} from '@repo/utilities'
import { gql, request } from 'graphql-request'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
import { useIdle } from 'react-use'
import { join, map, pipe, prop, split } from 'remeda'
import { Address, formatEther } from 'viem'
import { useWriteContract } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { Card, CardContent } from '@repo/ui/components/card'
import { Skeleton } from '@repo/ui/components/skeleton'
import { Button } from '@repo/ui/components/button'

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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? globalThis.location.origin
  const subgraphUrl = `${siteUrl}/subgraphs/blocks`

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
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [seed, setSeed] = useState<{
    background?: string
    body?: string
    accessory?: string
    head?: string
    glasses?: string
  }>({})

  const updateSeed = (key: string, value: string | undefined) => {
    setSeed((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // const { showBoundary } = useErrorBoundary()

  const renderSVG = useCallback((seed: Seed) => {
    const { parts, background } = getNounData(seed)
    // Transform the parts to match the expected type
    const formattedParts = parts
      .filter(
        (part): part is { filename: string; data: string } =>
          part !== undefined,
      )
      .map(({ data }) => ({ data }))
    const svgBinary = buildSVG(formattedParts, palette, background!)
    return btoa(svgBinary)
  }, [])

  const fetchData = useCallback(async () => {
    if (!nounId) return
    setIsLoading(false)

    const blockOffset = 0
    const blockLimit = 256

    const parseSeedParameter = (seedParam?: string): number | undefined =>
      seedParam && !Number.isNaN(Number(seedParam))
        ? Number(seedParam)
        : undefined

    const filterParams: Partial<Seed> = {
      background: parseSeedParameter(seed.background),
      body: parseSeedParameter(seed.body),
      accessory: parseSeedParameter(seed.accessory),
      head: parseSeedParameter(seed.head),
      glasses: parseSeedParameter(seed.glasses),
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
    } catch (error) {
      if (error instanceof Error) {
        // showBoundary(error)
      } else {
        // showBoundary('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }, [
    nounId,
    seed.background,
    seed.body,
    seed.accessory,
    seed.head,
    seed.glasses,
    // showBoundary,
  ])

  useEffect(() => {
    // Initial fetch on component mount
    fetchData().then(() => {})

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

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between p-1 py-5">
        <section className="w-full max-w-screen-xl p-1">
          <div className="container mx-auto">
            <div className="mb-4 w-full rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="background"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t`Select background`}
                  </label>
                  <select
                    id="background"
                    value={seed.background}
                    onChange={(e) => updateSeed('background', e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  >
                    <option value="">All backgrounds</option>
                    {ImageData.bgcolors.map((color: string, index: number) => (
                      <option key={index} value={index.toString()}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="body"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t`Select body`}
                  </label>
                  <select
                    id="body"
                    value={seed.body}
                    onChange={(e) => updateSeed('body', e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  >
                    <option value="">{t`All bodies`}</option>
                    {ImageData.images.bodies.map(
                      (
                        body: { filename: string; data: string },
                        index: number,
                      ) => (
                        <option key={index} value={index.toString()}>
                          {formatTraitName(body.filename)}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="accessory"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t`Select accessory`}
                  </label>
                  <select
                    id="accessory"
                    value={seed.accessory}
                    onChange={(e) => updateSeed('accessory', e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  >
                    <option value="">All accessories</option>
                    {ImageData.images.accessories.map(
                      (
                        accessory: { filename: string; data: string },
                        index: number,
                      ) => (
                        <option key={index} value={index.toString()}>
                          {formatTraitName(accessory.filename)}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="head"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t`Select head`}
                  </label>
                  <select
                    id="head"
                    value={seed.head}
                    onChange={(e) => updateSeed('head', e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  >
                    <option value="">All heads</option>
                    {ImageData.images.heads.map(
                      (
                        head: { filename: string; data: string },
                        index: number,
                      ) => (
                        <option key={index} value={index.toString()}>
                          {formatTraitName(head.filename)}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="glasses"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t`Select glasses`}
                  </label>
                  <select
                    id="glasses"
                    value={seed.glasses}
                    onChange={(e) => updateSeed('glasses', e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  >
                    <option value="">All glasses</option>
                    {ImageData.images.glasses.map(
                      (
                        glasses: { filename: string; data: string },
                        index: number,
                      ) => (
                        <option key={index} value={index.toString()}>
                          {formatTraitName(glasses.filename)}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="noun-id"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Noun ID
                    </label>
                    <input
                      id="noun-id"
                      name="noun-id"
                      type="text"
                      value={Number(nounId)}
                      placeholder="Noun"
                      readOnly={true}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="price"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Price
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="text"
                      value={formatEther(BigInt(price ?? 0))}
                      placeholder="Noun"
                      readOnly={true}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            <AuctionPreviewGrid
              isLoading={isLoading}
              seedsData={seedsData}
              renderSVG={renderSVG}
              handleBuy={handleBuy}
            />
          </div>
        </section>
      </div>
    </>
  )
}

interface AuctionPreviewGridProps {
  isLoading: boolean
  seedsData: SeedData[]
  renderSVG: (seed: any) => string
  handleBuy: (blockNumber: number) => void
}

function AuctionPreviewGrid({
  isLoading,
  seedsData,
  renderSVG,
  handleBuy,
}: AuctionPreviewGridProps) {
  return (
    <div className="grid grid-cols-2 gap-6 text-gray-900 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 dark:text-gray-200">
      {isLoading
        ? Array.from({ length: 12 }).map((_, index) => (
            <Card key={index} className="rounded-lg shadow-md">
              <CardContent className="p-4">
                <Skeleton className="h-32 w-full rounded-lg" />
              </CardContent>
            </Card>
          ))
        : seedsData.map(({ blockNumber, seed }) => (
            <Card
              key={blockNumber}
              className="group relative rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={`data:image/svg+xml;base64,${renderSVG(seed)}`}
                alt={`Noun ${blockNumber}`}
                className="h-auto w-full rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  onClick={() => handleBuy(blockNumber)}
                  variant="secondary"
                  className="px-6 py-2"
                >
                  Buy
                </Button>
              </div>
            </Card>
          ))}
    </div>
  )
}

export default Auction
