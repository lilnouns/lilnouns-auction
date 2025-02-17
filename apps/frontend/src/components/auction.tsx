'use client'

import { AuctionPreviewGrid } from '@/components/auction-preview-grid'
import React from 'react'

export default function Auction() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between p-1">
        <section className="w-full max-w-screen-xl p-1">
          <div className="container mx-auto">
            <AuctionPreviewGrid />
          </div>
        </section>
      </div>
    </>
  )
}
