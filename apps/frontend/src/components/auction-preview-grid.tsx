import { PoolSeed } from '@/types'
import { Card, CardContent } from '@repo/ui/components/card'
import { Skeleton } from '@repo/ui/components/skeleton'
import { Button } from '@repo/ui/components/button'
import React from 'react'

interface AuctionPreviewGridProps {
  isLoading: boolean
  items: PoolSeed[]
  renderSVG: (seed: any) => string
  handleBuy: (blockNumber: number) => void
}

export function AuctionPreviewGrid({
  isLoading,
  items,
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
        : items.map(({ blockNumber, seed }) => (
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
