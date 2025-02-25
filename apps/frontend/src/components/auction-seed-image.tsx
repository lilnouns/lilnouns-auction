'use client'

import { Seed } from '@/types'
import { useCallback } from 'react'
import { buildSVG, EncodedImage } from '@lilnounsdao/sdk'

import { getNounData, imageData } from '@repo/assets/index'

const { palette } = imageData

export function AuctionSeedImage({ seed }: { seed: Seed }) {
  const renderSVG = useCallback((seed: Seed) => {
    const { parts, background } = getNounData(seed)
    const validParts = parts.filter(
      (part): part is NonNullable<typeof part> => part !== undefined,
    )

    const formattedParts: EncodedImage[] = validParts.map((part) => ({
      data: part.data,
      filename: part.filename || '', // Add filename if it's required by EncodedImage type
    }))

    const svgBinary = buildSVG(formattedParts, palette, background!)
    return btoa(svgBinary)
  }, [])

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`data:image/svg+xml;base64,${renderSVG(seed)}`}
      className="h-full w-full object-cover rounded-lg"
      alt="Noun"
    />
  )
}
