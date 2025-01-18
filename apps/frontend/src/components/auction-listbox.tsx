'use client'

import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { join, map, pipe, split } from 'remeda'

// Union type for item formats
type AuctionItem = string | { filename: string; data: string | undefined }

interface AuctionListboxProps {
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

const AuctionListbox: React.FC<AuctionListboxProps> = ({
  items,
  label,
  placeholder = 'Select an item...',
  onChange,
}) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>()

  const filteredItems =
    query === ''
      ? [{ filename: 'None', data: undefined }, ...items]
      : [
          { filename: 'None', data: undefined },
          ...items.filter((item) => {
            const value = getItemDisplayValue(item)
            return value.toLowerCase().includes(query.toLowerCase())
          }),
        ]

  const handleChange = (selectedItem: AuctionItem | undefined) => {
    if (
      selectedItem &&
      typeof selectedItem !== 'string' &&
      selectedItem.filename === 'None'
    ) {
      setSelectedIndex(undefined)
      setQuery('') // Explicitly reset query
      onChange()
      return
    }

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

    if (index === selectedIndex) {
      setSelectedIndex(undefined)
      onChange()
    } else {
      setSelectedIndex(index)
      onChange(selectedItem, index)
    }
  }

  const getValidSelectedItem = () => {
    if (
      selectedIndex === undefined ||
      selectedIndex < 0 ||
      selectedIndex >= items.length
    ) {
      return
    }
    return items[selectedIndex]
  }

  return (
    <Listbox
      as="div"
      value={selectedIndex === undefined ? undefined : items[selectedIndex]}
      onChange={(item) => handleChange(item ?? undefined)}
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </Label>
      <div className="relative mt-2">
        <ListboxButton className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          {getValidSelectedItem()
            ? getItemDisplayValue(getValidSelectedItem()!)
            : placeholder}
          <ChevronUpDownIcon
            className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 text-gray-400"
            aria-hidden="true"
          />
        </ListboxButton>

        {filteredItems.length > 0 && (
          <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filteredItems.map((item, index) => (
              <ListboxOption
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
              </ListboxOption>
            ))}
          </ListboxOptions>
        )}
      </div>
    </Listbox>
  )
}

export default AuctionListbox
