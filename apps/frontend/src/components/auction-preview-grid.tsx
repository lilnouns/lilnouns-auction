'use client'

import { Block, BlockData, PoolSeed, Seed } from '@/types'

import { usePoolStore } from '@/stores/pool-store'
import { useEffect } from 'react'

import { getNounSeedFromBlockHash } from '@repo/assets/index'
import { useTraitFilterStore } from '@/stores/trait-filter-store'
import { useNextNoun } from '@/hooks/use-next-noun'

import useSWR from 'swr'
import { gql, request } from 'graphql-request'

import { TriangleAlert } from 'lucide-react'
import { cn } from '@repo/ui/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert'
import { Card, CardContent } from '@repo/ui/components/card'

import { AuctionSeedDialog } from '@/components/auction-seed-dialog'
import { AuctionSeedImage } from '@/components/auction-seed-image'
import { useLingui } from '@lingui/react/macro'

const fetchBlocks = async (
  offset: number,
  limit: number,
  after?: number,
  before?: number,
): Promise<Block[]> => {
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

export function AuctionPreviewGrid() {
  const { t } = useLingui()
  const { nounId } = useNextNoun()
  const { traitFilter } = useTraitFilterStore()
  const { poolSeeds, setPoolSeeds, setIsLoading } = usePoolStore()

  // Check if any filters are active
  const hasActiveFilters = Object.values(traitFilter).some(
    (filter) => filter && filter.length > 0,
  )

  const blockOffset = 0
  const blockLimit = 256

  const {
    data: blocks,
    error,
    isValidating,
  } = useSWR(
    ['blocks', blockOffset, blockLimit],
    () => fetchBlocks(blockOffset, blockLimit),
    { refreshInterval: 12000 },
  )

  useEffect(() => {
    setIsLoading(isValidating)
    if (!blocks || nounId === undefined) return

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

    const processSeeds = async () => {
      let seedResults: PoolSeed[] = []

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
            console.error(`Error generating seed for block ${block.id}:`, error)
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
    }

    processSeeds()
  }, [blocks, nounId, traitFilter, setPoolSeeds, setIsLoading, isValidating])

  const renderNoResultsMessage = () => (
    <Alert>
      <TriangleAlert className="size-4" />
      <AlertTitle>{t`No Nouns Found`}</AlertTitle>
      <AlertDescription>
        {hasActiveFilters
          ? t`No Nouns match your current filter criteria. Try adjusting your filters.`
          : t`There are no Nouns available to display.`}
      </AlertDescription>
    </Alert>
  )

  if (error) return renderNoResultsMessage()

  if (!isValidating && nounId === undefined)
    return (
      <Alert variant="destructive">
        <TriangleAlert className="size-4" />
        <AlertTitle>{t`Error`}</AlertTitle>
        <AlertDescription>
          {t`No Noun ID found. Please refresh the page.`}
        </AlertDescription>
      </Alert>
    )

  return (
    <>
      {poolSeeds.length === 0 && !isValidating && renderNoResultsMessage()}

      <div
        className={cn(
          'grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9',
        )}
      >
        {poolSeeds.map((poolSeed) => (
          <AuctionSeedDialog
            key={`${poolSeed.nounId}-${poolSeed.blockNumber}`}
            poolSeed={poolSeed}
          >
            <Card className="w-full shadow-xs border-none cursor-pointer py-0">
              <CardContent className="px-0">
                <AuctionSeedImage seed={poolSeed.seed} />
              </CardContent>
            </Card>
          </AuctionSeedDialog>
        ))}
      </div>
    </>
  )
}
