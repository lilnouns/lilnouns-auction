'use client'

import { Seed } from '@/types'
import { useCallback } from 'react'
import { buildSVG, EncodedImage } from '@lilnounsdao/sdk'

import { getNounData, imageData } from '@repo/assets/index'

const { palette } = imageData

export function AuctionSeedImage({ seed }: { seed: Seed }) {
  const renderSVG = useCallback((seed: Seed) => {
    const { parts, background } = getNounData(seed)
    // Transform the parts to match the expected type
    const formattedParts = parts
      .filter((part): part is EncodedImage => part !== undefined)
      .map(({ data }) => ({ data }))
    const svgBinary = buildSVG(formattedParts, palette, background!)
    return btoa(svgBinary)
  }, [])

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`data:image/svg+xml;base64,${renderSVG(seed)}`}
      className="h-full w-full object-cover rounded-lg"
      alt={`Noun`}
    />
  )
}
