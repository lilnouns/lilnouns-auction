'use client'

import { getNounSeedFromBlockHash } from '@repo/utilities'
import { gql, request } from 'graphql-request'
import React, { useCallback, useEffect } from 'react'

import { useIdle } from 'react-use'
import { Block, BlockData, PoolSeed, Seed } from '@/types'

import { AuctionTraitFilter } from '@/components/auction-trait-filter'
import { AuctionPreviewGrid } from '@/components/auction-preview-grid'

import { usePoolStore } from '@/stores/use-pool-store'
import { useTraitFilterStore } from '@/stores/use-trait-filter-store'

import { useNextNoun } from '@/hooks/use-next-noun'

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

export default function Auction() {
  // Detect if user is idle. Idle threshold set to 10 minutes (600000 ms).
  const isIdle = useIdle(600_000)

  const { nounId, price } = useNextNoun()

  const { traitFilter } = useTraitFilterStore()
  const { setPoolSeeds, setIsLoading } = usePoolStore()

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
      background: parseSeedParameter(traitFilter.background),
      body: parseSeedParameter(traitFilter.body),
      accessory: parseSeedParameter(traitFilter.accessory),
      head: parseSeedParameter(traitFilter.head),
      glasses: parseSeedParameter(traitFilter.glasses),
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
              ? { blockNumber: BigInt(block.number), nounId, seed }
              : { blockNumber: BigInt(block.number), nounId, seed: undefined }
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
            return {
              blockNumber: BigInt(block.number),
              nounId,
              seed: undefined,
            }
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
    traitFilter.background,
    traitFilter.body,
    traitFilter.accessory,
    traitFilter.head,
    traitFilter.glasses,
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

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between p-1 py-5">
        <section className="w-full max-w-screen-xl p-1">
          <div className="container mx-auto">
            <AuctionTraitFilter nounId={nounId} price={price} />
            <AuctionPreviewGrid />
          </div>
        </section>
      </div>
    </>
  )
}
