'use client'

import React from 'react'

import { AuctionTraitFilter } from '@/components/auction-trait-filter'
import { AuctionPreviewGrid } from '@/components/auction-preview-grid'

export default function Auction() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between p-1 py-5">
        <section className="w-full max-w-screen-xl p-1">
          <div className="container mx-auto">
            <AuctionTraitFilter />
            <AuctionPreviewGrid />
          </div>
        </section>
      </div>
    </>
  )
}
