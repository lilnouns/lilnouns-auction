'use client'

import { Label } from '@repo/ui/components/label'
import React from 'react'
import { MultiSelect } from '@/components/multi-select'

import { imageData } from '@repo/assets/index'

import { TraitFilter, useTraitFilterStore } from '@/stores/trait-filter-store'
import { formatTraitName } from '@/utils/format-trait-name'
import { useLingui } from '@lingui/react/macro'

type TraitOptions = Array<{
  id: keyof TraitFilter
  label: string
  options: string[] | { filename: string }[]
}>

export function AuctionTraitFilter() {
  const { i18n, t } = useLingui()
  const { traitFilter, setTraitFilter } = useTraitFilterStore()

  const traitOptions: TraitOptions = [
    {
      id: /*i18n*/ 'background',
      label: /*i18n*/ 'Background',
      options: imageData.bgcolors,
    },
    {
      id: /*i18n*/ 'body',
      label: /*i18n*/ 'Body',
      options: imageData.images.bodies,
    },
    {
      id: /*i18n*/ 'accessory',
      label: /*i18n*/ 'Accessory',
      options: imageData.images.accessories,
    },
    {
      id: /*i18n*/ 'head',
      label: /*i18n*/ 'Head',
      options: imageData.images.heads,
    },
    {
      id: /*i18n*/ 'glasses',
      label: /*i18n*/ 'Glasses',
      options: imageData.images.glasses,
    },
  ]

  return (
    <div className="flex flex-col gap-2 px-0">
      {traitOptions.map(({ id, label, options }) => (
        <div className="grid gap-2" key={id}>
          <Label htmlFor={id}>{label}</Label>
          <MultiSelect
            options={options.map((option, index) => {
              const backgrounds: { [key: string]: string } = {
                d5d7e1: 'cold',
                e1d7d5: 'warm',
              }
              return {
                label: i18n._(
                  formatTraitName(
                    typeof option !== 'string'
                      ? option?.filename
                      : backgrounds[option]!,
                  ),
                ),
                value: index.toString(),
              }
            })}
            onValueChange={(value) => setTraitFilter(id, value)}
            defaultValue={traitFilter[id] ?? []}
            placeholder={t`Select ${label.toLowerCase()}`}
            variant="inverted"
            animation={0}
            maxCount={2}
            className={'shadow-none min-h-10'}
          />
        </div>
      ))}
    </div>
  )
}
