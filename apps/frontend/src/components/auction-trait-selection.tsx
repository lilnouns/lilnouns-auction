import { Card, CardContent } from '@repo/ui/components/card'
import { Label } from '@repo/ui/components/label'
import { Input } from '@repo/ui/components/input'
import { formatEther } from 'viem'
import React from 'react'
import { join, map, pipe, split } from 'remeda'
import { MultiSelect } from '@repo/ui/components/multi-select'

interface AuctionTraitSelectionProps {
  seed: Record<string, string[]>
  onTraitChange: (trait: string, value: string[]) => void
  ImageData: {
    bgcolors: string[]
    images: {
      bodies: Array<{ filename: string }>
      accessories: Array<{ filename: string }>
      heads: Array<{ filename: string }>
      glasses: Array<{ filename: string }>
    }
  }
  nounId?: bigint
  price?: bigint
}

export function AuctionTraitSelection({
  seed,
  onTraitChange,
  ImageData,
  nounId,
  price,
}: AuctionTraitSelectionProps) {
  return (
    <Card className="mb-4 w-full">
      <CardContent className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        {[
          {
            id: 'background',
            label: 'Background',
            options: ImageData.bgcolors,
          },
          {
            id: 'body',
            label: 'Body',
            options: ImageData.images.bodies,
          },
          {
            id: 'accessory',
            label: 'Accessory',
            options: ImageData.images.accessories,
          },
          {
            id: 'head',
            label: 'Head',
            options: ImageData.images.heads,
          },
          {
            id: 'glasses',
            label: 'Glasses',
            options: ImageData.images.glasses,
          },
        ].map(({ id, label, options }) => (
          <div key={id}>
            <Label htmlFor={id}>{label}</Label>
            <MultiSelect
              options={options.map((option, index) => {
                const backgrounds: { [key: string]: string } = {
                  d5d7e1: 'cold',
                  e1d7d5: 'warm',
                }
                return {
                  label: formatTraitName(
                    typeof option !== 'string'
                      ? option?.filename
                      : backgrounds[option]!,
                  ),
                  value: index.toString(),
                }
              })}
              onValueChange={(value) => onTraitChange(id, value)}
              defaultValue={seed[id] ?? []}
              placeholder={`Select ${label.toLowerCase()}`}
              variant="inverted"
              animation={0}
              maxCount={2}
              className={'shadow-none min-h-10'}
            />
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="noun-id">Noun ID</Label>
            <Input
              id="noun-id"
              value={Number(nounId)}
              readOnly
              className={'shadow-none min-h-10'}
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={formatEther(BigInt(price ?? 0))}
              readOnly
              className={'shadow-none min-h-10'}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Formats the given trait name by capitalizing each part of the name and
 * removing specific prefixes if present.
 *
 * @param traitName - The trait name to format.
 * @returns The formatted trait name.
 */
function formatTraitName(traitName: string): string {
  const prefixes = new Set(['head', 'accessory', 'glasses', 'body'])

  return pipe(
    traitName,
    split('-'),
    (parts) => (prefixes.has(parts[0] ?? '') ? parts.slice(1) : parts),
    map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : '')),
    join(' '),
  )
}
