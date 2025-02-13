import { Card, CardContent } from '@repo/ui/components/card'
import { Label } from '@repo/ui/components/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select'
import { Input } from '@repo/ui/components/input'
import { formatEther } from 'viem'
import React from 'react'
import { join, map, pipe, split } from 'remeda'

interface AuctionTraitSelectionProps {
  seed: Record<string, string>
  updateSeed: (trait: string, value: string) => void
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
  updateSeed,
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
            label: 'Select background',
            options: ImageData.bgcolors,
          },
          {
            id: 'body',
            label: 'Select body',
            options: ImageData.images.bodies,
          },
          {
            id: 'accessory',
            label: 'Select accessory',
            options: ImageData.images.accessories,
          },
          {
            id: 'head',
            label: 'Select head',
            options: ImageData.images.heads,
          },
          {
            id: 'glasses',
            label: 'Select glasses',
            options: ImageData.images.glasses,
          },
        ].map(({ id, label, options }) => (
          <div key={id}>
            <Label htmlFor={id}>{label}</Label>
            <Select onValueChange={(value) => updateSeed(id, value)}>
              <SelectTrigger>
                <SelectValue placeholder={`All ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">
                  All {label.toLowerCase()}
                </SelectItem>
                {options.map((option, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {formatTraitName(
                      typeof option !== 'string' ? option?.filename : option,
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="noun-id">Noun ID</Label>
            <Input id="noun-id" value={Number(nounId)} readOnly />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={formatEther(BigInt(price ?? 0))}
              readOnly
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
