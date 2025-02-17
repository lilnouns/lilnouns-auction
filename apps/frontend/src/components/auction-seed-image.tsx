import { Seed } from '@/types'
import { useCallback } from 'react'
import { getNounData } from '@lilnounsdao/assets'
import { buildSVG } from '@lilnounsdao/sdk'

import { ImageData } from '@repo/utilities'

const { palette } = ImageData

export function AuctionSeedImage({ seed }: { seed: Seed }) {
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
