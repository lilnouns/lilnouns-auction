'use client'

import { getNounSeedFromBlockHash, ImageData } from '@repo/utilities'
import { gql, request } from 'graphql-request'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

import { useIdle } from 'react-use'
import { prop } from 'remeda'
import { Address } from 'viem'
import { useWriteContract } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { Block, BlockData, Seed, PoolSeed } from '@/types'

import { AuctionTraitSelection } from '@/components/auction-trait-selection'
import { AuctionPreviewGrid } from '@/components/auction-preview-grid'

import { usePoolStore } from '@/stores/use-pool-store'

const activeChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)
const activeChainContracts: Record<number, Address> = {
  [mainnet.id]: '0xA2587b1e2626904c8575640512b987Bd3d3B592D',
  [sepolia.id]: '0x0d8c4d18765AB8808ab6CEE4d7A760e8b93AB20c',
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

interface AuctionProps {
  nounId?: bigint | undefined
  price?: bigint | undefined
}

const Auction: React.FC<AuctionProps> = ({ nounId, price }) => {
  // Detect if user is idle. Idle threshold set to 10 minutes (600000 ms).
  const isIdle = useIdle(600_000)

  const { setPoolSeeds, setIsLoading } = usePoolStore()

  const [seed, setSeed] = useState<{
    background?: string[]
    body?: string[]
    accessory?: string[]
    head?: string[]
    glasses?: string[]
  }>({})

  const updateSeed = (key: string, value: string[] | undefined) => {
    setSeed((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // const { showBoundary } = useErrorBoundary()

  const fetchData = useCallback(async () => {
    if (!nounId) return
    setIsLoading(false)

    const blockOffset = 0
    const blockLimit = 256

    const parseSeedParameter = (seedParams?: string[]): number[] | undefined =>
      seedParams
        ?.map((param) =>
          !Number.isNaN(Number(param)) ? Number(param) : undefined,
        )
        .filter((num): num is number => num !== undefined) ?? undefined

    const filterParams = {
      background: parseSeedParameter(seed.background),
      body: parseSeedParameter(seed.body),
      accessory: parseSeedParameter(seed.accessory),
      head: parseSeedParameter(seed.head),
      glasses: parseSeedParameter(seed.glasses),
    }

    let seedResults: PoolSeed[] = []

    try {
      const blocks = await fetchBlocks(blockOffset, blockLimit)
      const newSeedResults = await Promise.all(
        blocks.map(async (block) => {
          try {
            const seed = getNounSeedFromBlockHash(Number(nounId), block.id)
            const isMatching = Object.entries(filterParams).every(
              ([key, values]) => {
                if (!values || values.length === 0) return true
                const seedValue = seed[key as keyof Seed]
                return values.includes(seedValue)
              },
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
          (result): result is PoolSeed => result.seed !== undefined,
        ),
      ]

      setPoolSeeds(seedResults)
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
              nounId={nounId}
              price={price}
            />
            <AuctionPreviewGrid handleBuy={handleBuy} />
          </div>
        </section>
      </div>
    </>
  )
}

export default Auction
