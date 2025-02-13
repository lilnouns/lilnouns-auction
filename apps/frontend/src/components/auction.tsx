'use client'

import { buildSVG } from '@lilnounsdao/sdk'
import {
  ImageData,
  getNounData,
  getNounSeedFromBlockHash,
} from '@repo/utilities'
import { gql, request } from 'graphql-request'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
// import { useErrorBoundary } from 'react-error-boundary'
import { useIdle } from 'react-use'
import { join, map, pipe, prop, split } from 'remeda'
import { Address, formatEther } from 'viem'
import { useWriteContract } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { Card, CardContent } from '@repo/ui/components/card'
import { Skeleton } from '@repo/ui/components/skeleton'
import { Button } from '@repo/ui/components/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select'
import { Input } from '@repo/ui/components/input'
import { Label } from '@repo/ui/components/label'

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
            <AuctionTraitSelection
              seed={seed}
              updateSeed={updateSeed}
              ImageData={ImageData}
              formatTraitName={formatTraitName}
              nounId={nounId}
              price={price}
            />
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

interface AuctionTraitSelectionProps {
  seed: Record<string, string>
  updateSeed: (trait: string, value: string) => void
  ImageData: {
    bgcolors: string[]
    images: {
      bodies: Array<{ filename: string }>
      accessories: Array<{ filename: string }>
      heads: Array<{ filename: string }>
      glasses: Array<{ filename: string }>
    }
  }
  formatTraitName: (name: string) => string
  nounId?: bigint
  price?: bigint
}

export function AuctionTraitSelection({
  updateSeed,
  ImageData,
  formatTraitName,
  nounId,
  price,
}: AuctionTraitSelectionProps) {
  return (
    <Card className="mb-4 w-full">
      <CardContent className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        {[
          {
            id: 'background',
            label: 'Select background',
            options: ImageData.bgcolors,
          },
          {
            id: 'body',
            label: 'Select body',
            options: ImageData.images.bodies,
            format: true,
          },
          {
            id: 'accessory',
            label: 'Select accessory',
            options: ImageData.images.accessories,
            format: true,
          },
          {
            id: 'head',
            label: 'Select head',
            options: ImageData.images.heads,
            format: true,
          },
          {
            id: 'glasses',
            label: 'Select glasses',
            options: ImageData.images.glasses,
            format: true,
          },
        ].map(({ id, label, options, format }) => (
          <div key={id}>
            <Label htmlFor={id}>{label}</Label>
            <Select onValueChange={(value) => updateSeed(id, value)}>
              <SelectTrigger>
                <SelectValue placeholder={`All ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">
                  All {label.toLowerCase()}
                </SelectItem>
                {options.map((option, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {formatTraitName(
                      typeof option !== 'string' ? option?.filename : option,
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="noun-id">Noun ID</Label>
            <Input id="noun-id" value={Number(nounId)} readOnly />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={formatEther(BigInt(price ?? 0))}
              readOnly
            />
          </div>
        </div>
      </CardContent>
    </Card>
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
