import { Seed } from '@/types'
import { Card, CardContent } from '@repo/ui/components/card'
import { Skeleton } from '@repo/ui/components/skeleton'
import { Button } from '@repo/ui/components/button'

import { usePoolStore } from '@/stores/use-pool-store'
import { useCallback } from 'react'

import { buildSVG } from '@lilnounsdao/sdk'
import { getNounData } from '@lilnounsdao/assets'

import { ImageData } from '@repo/utilities'

const { palette } = ImageData

interface AuctionPreviewGridProps {
  handleBuy: (blockNumber: number) => void
}

export function AuctionPreviewGrid({ handleBuy }: AuctionPreviewGridProps) {
  const { poolSeeds, isLoading } = usePoolStore()

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
    <div className="grid grid-cols-2 gap-6 text-gray-900 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 dark:text-gray-200">
      {isLoading
        ? Array.from({ length: 12 }).map((_, index) => (
            <Card key={index} className="rounded-lg shadow-md">
              <CardContent className="p-4">
                <Skeleton className="h-32 w-full rounded-lg" />
              </CardContent>
            </Card>
          ))
        : poolSeeds.map(({ blockNumber, seed }) => (
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
