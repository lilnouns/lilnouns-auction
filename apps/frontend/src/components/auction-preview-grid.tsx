'use client'

import { PoolSeed, Seed } from '@/types'

import { usePoolStore } from '@/stores/pool-store'
import { useEffect, useMemo } from 'react'

import { getNounSeedFromBlockHash } from '@repo/assets/index'
import { useTraitFilterStore } from '@/stores/trait-filter-store'
import { useNextNoun } from '@/hooks/use-next-noun'
import { Card, CardContent } from '@repo/ui/components/card'
import { Skeleton } from '@repo/ui/components/skeleton'
import { AuctionSeedDialog } from '@/components/auction-seed-dialog'
import { AuctionSeedImage } from '@/components/auction-seed-image'
import { filter, isTruthy, map, pipe, times } from 'remeda'
import { useBlocks } from '@/hooks/use-blocks'
import { useAsyncRetry } from 'react-use'
import { useIdleState } from '@/contexts/idle-context'

export function AuctionPreviewGrid() {
  const { nounId } = useNextNoun()
  const { traitFilter } = useTraitFilterStore()
  const { poolSeeds, setPoolSeeds, setIsLoading } = usePoolStore()
  const { isIdle } = useIdleState()

  const {
    data: blocks,
    error: blocksError,
    isValidating: isValidatingBlocks,
    isLoading: isLoadingBlocks,
  } = useBlocks()

  useEffect(() => {
    if (blocksError) {
      console.error('Blocks error:', blocksError)
    }
  }, [blocksError])

  useEffect(() => {
    if (nounId === undefined) {
      console.error('No Noun ID found. Please refresh the page.')
    }
  }, [nounId])

  const filterParams = useMemo(() => {
    const parseSeedParameter = (seedParams?: string[]) =>
      seedParams
        ? pipe(
            seedParams,
            map((param) => Number(param)),
            filter((num): num is number => !Number.isNaN(num)),
          )
        : undefined

    return {
      background: parseSeedParameter(traitFilter.background),
      body: parseSeedParameter(traitFilter.body),
      accessory: parseSeedParameter(traitFilter.accessory),
      head: parseSeedParameter(traitFilter.head),
      glasses: parseSeedParameter(traitFilter.glasses),
    }
  }, [traitFilter])

  const seedState = useAsyncRetry<PoolSeed[]>(async () => {
    if (isIdle || !blocks || nounId === undefined) return []

    const seedResults = await Promise.all(
      blocks.map(async (block) => {
        try {
          const seed = getNounSeedFromBlockHash(Number(nounId), block.id)
          const matchesFilter = Object.entries(filterParams).every(
            ([key, values]) => {
              if (!values?.length) return true
              const seedValue = seed[key as keyof Seed]
              return values.includes(seedValue)
            },
          )

          if (!matchesFilter) {
            return undefined
          }

          return { blockNumber: BigInt(block.number), nounId, seed }
        } catch (error) {
          console.error(`Error generating seed for block ${block.id}:`, error)
          return undefined
        }
      }),
    )

    return pipe(seedResults, filter(isTruthy))
  }, [blocks, filterParams, isIdle, nounId])

  useEffect(() => {
    setIsLoading(
      !isIdle && (isValidatingBlocks || isLoadingBlocks || seedState.loading),
    )
  }, [
    isIdle,
    isValidatingBlocks,
    isLoadingBlocks,
    seedState.loading,
    setIsLoading,
  ])

  useEffect(() => {
    if (seedState.error) {
      console.error('Failed to build pool seeds:', seedState.error)
    }
  }, [seedState.error])

  useEffect(() => {
    if (!isIdle && seedState.value !== undefined) {
      setPoolSeeds(seedState.value)
    }
  }, [isIdle, seedState.value, setPoolSeeds])

  if (poolSeeds.length === 0) {
    return (
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9">
        {times(256, (index) => (
          <Card
            key={index}
            className="w-full shadow-xs border-none cursor-pointer py-0"
          >
            <CardContent className="px-0">
              <Skeleton className="w-full h-full aspect-square object-cover rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9">
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
  )
}
