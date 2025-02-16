import { Block, BlockData, PoolSeed, Seed } from '@/types'
import { Card, CardContent } from '@repo/ui/components/card'
import { Button } from '@repo/ui/components/button'

import { usePoolStore } from '@/stores/pool-store'
import { useCallback, useEffect } from 'react'

import { buildSVG } from '@lilnounsdao/sdk'
import { getNounData } from '@lilnounsdao/assets'

import { getNounSeedFromBlockHash, ImageData } from '@repo/utilities'

import { useTraitFilterStore } from '@/stores/trait-filter-store'
import { useNextNoun } from '@/hooks/use-next-noun'
import { useBuyNow } from '@/hooks/use-buy-now'

import { useIdle } from 'react-use'
import { gql, request } from 'graphql-request'
import { cn } from '@repo/ui/lib/utils'
import { useAccount } from 'wagmi'
import { walletOptions } from '@/components/wallet-options-dialog'
import { useDialogStore } from '@/stores/dialog-store'

const { palette } = ImageData

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

export function AuctionPreviewGrid() {
  // Detect if user is idle. Idle threshold set to 10 minutes (600000 ms).
  const isIdle = useIdle(600_000)

  const { nounId } = useNextNoun()

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

  const { poolSeeds } = usePoolStore()
  const { handleBuy } = useBuyNow()

  const { isConnected } = useAccount()
  const { openDialog } = useDialogStore()

  return (
    <>
      {poolSeeds.length === 0 && <NoContentMessage />}

      <div
        className={cn(
          'grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9',
        )}
      >
        {poolSeeds.map(({ blockNumber, nounId, seed }) => (
          <Card
            key={blockNumber}
            className="group relative rounded-lg shadow-none overflow-hidden"
          >
            <NounImage seed={seed} />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                onClick={() => {
                  if (!isConnected) {
                    openDialog(walletOptions)
                  } else {
                    handleBuy(blockNumber, nounId)
                  }
                }}
                variant="secondary"
                className="px-6 py-2"
              >
                Buy
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}

function NounImage({ seed }: { seed: Seed }) {
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

  return (
    <img
      src={`data:image/svg+xml;base64,${renderSVG(seed)}`}
      className="h-auto w-full rounded-lg"
      alt={`Noun`}
    />
  )
}

export function NoContentMessage() {
  const { traitFilter } = useTraitFilterStore()

  // Check if any filters are active
  const hasActiveFilters = Object.values(traitFilter).some(
    (filter) => filter && filter.length > 0,
  )

  return (
    <Card className="w-full shadow-none">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">No Nouns Found</h3>
        <p className="text-gray-500">
          {hasActiveFilters
            ? 'No Nouns match your current filter criteria. Try adjusting your filters.'
            : 'There are no Nouns available to display.'}
        </p>
      </CardContent>
    </Card>
  )
}
