'use client'

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
} from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { join, map, pipe, split } from 'remeda'

// Union type for item formats
type AuctionItem = string | { filename: string; data: string }

interface AuctionComboboxProps {
  items: AuctionItem[]
  label: string
  placeholder?: string
  onChange: (
    selectedItem?: AuctionItem | undefined,
    index?: number | undefined,
  ) => void
}

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

const getItemDisplayValue = (item: AuctionItem): string => {
  return typeof item === 'string' ? item : formatTraitName(item.filename)
}

const AuctionCombobox: React.FC<AuctionComboboxProps> = ({
  items,
  label,
  placeholder = 'Select an item...',
  onChange,
}) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>()

  const filteredItems =
    query === ''
      ? items
      : items.filter((item) => {
          const value = getItemDisplayValue(item)
          return value.toLowerCase().includes(query.toLowerCase())
        })

  const handleChange = (selectedItem: AuctionItem | undefined) => {
    const index =
      selectedItem === undefined
        ? undefined
        : items.findIndex(
            (item) =>
              (typeof item === 'string' ? item : item.filename) ===
              (typeof selectedItem === 'string'
                ? selectedItem
                : selectedItem.filename),
          )

    // Deselect if the same option is clicked
    if (index === selectedIndex) {
      setSelectedIndex(undefined)
      onChange()
    } else {
      setSelectedIndex(index)
      onChange(selectedItem, index)
    }
  }

  return (
    <Combobox
      as="div"
      value={selectedIndex === undefined ? undefined : items[selectedIndex]}
      onChange={(item) => handleChange(item ?? undefined)} // Convert null to undefined
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </Label>
      <div className="relative mt-2">
        <ComboboxInput
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => setQuery('')}
          displayValue={(item: AuctionItem | undefined) =>
            item ? getItemDisplayValue(item) : ''
          }
          placeholder={placeholder}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="size-5 text-gray-400"
            aria-hidden="true"
          />
        </ComboboxButton>

        {filteredItems.length > 0 && (
          <ComboboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filteredItems.map((item, index) => (
              <ComboboxOption
                key={index}
                value={item}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
              >
                <div className="flex items-center">
                  <span className="ml-3 truncate group-data-[selected]:font-semibold">
                    {getItemDisplayValue(item)}
                  </span>
                </div>

                <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                  <CheckIcon className="size-5" aria-hidden="true" />
                </span>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  )
}

export default AuctionCombobox
