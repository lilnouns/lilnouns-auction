'use client'

import { t } from '@lingui/macro'
import { ImageData } from '@shared/utilities'
import { Drawer } from 'flowbite-react'
import React from 'react'
import { HiBars2, HiSquaresPlus } from 'react-icons/hi2'
import { join, map, pipe, split } from 'remeda'
import { formatEther } from 'viem'

interface AuctionDrawerProps {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
  seed: {
    background?: string
    body?: string
    accessory?: string
    head?: string
    glasses?: string
  }
  nounId?: bigint | undefined
  price?: bigint | undefined
  updateSeed: (key: string, value: string | undefined) => void
}

const AuctionDrawer: React.FC<AuctionDrawerProps> = ({
  isOpen,
  onClose,
  onOpen,
  seed,
  nounId,
  price,
  updateSeed,
}) => {
  if (!isOpen) return

  return (
    <>
      {/*<div className="flex min-h-[50vh] items-center justify-center">
        <Button onClick={() => onOpen()}>Show swipeable drawer</Button>
      </div>*/}
      <Drawer
        edge
        open={isOpen}
        onClose={onClose}
        position="bottom"
        className="p-0"
      >
        <Drawer.Header
          closeIcon={HiBars2}
          title="Filter Traits"
          titleIcon={HiSquaresPlus}
          onClick={() => (isOpen ? onClose() : onOpen())}
          className="cursor-pointer px-4 pt-4 hover:bg-gray-50 dark:hover:bg-gray-700"
        />
        <Drawer.Items className="p-4">
          <div className="mb-4 w-full rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
            <div className="grid grid-cols-2 gap-4 p-4">
              <div>
                <label
                  htmlFor="background"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  {t`Select background`}
                </label>
                <select
                  id="background"
                  value={seed.background}
                  onChange={(e) => updateSeed('background', e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                >
                  <option value="">All backgrounds</option>
                  {ImageData.bgcolors.map((color: string, index: number) => (
                    <option key={index} value={index.toString()}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="body"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  {t`Select body`}
                </label>
                <select
                  id="body"
                  value={seed.body}
                  onChange={(e) => updateSeed('body', e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                >
                  <option value="">{t`All bodies`}</option>
                  {ImageData.images.bodies.map((body: any, index: number) => (
                    <option key={index} value={index.toString()}>
                      {formatTraitName(body.filename)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="accessory"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  {t`Select accessory`}
                </label>
                <select
                  id="accessory"
                  value={seed.accessory}
                  onChange={(e) => updateSeed('accessory', e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                >
                  <option value="">All accessories</option>
                  {ImageData.images.accessories.map(
                    (accessory: any, index: number) => (
                      <option key={index} value={index.toString()}>
                        {formatTraitName(accessory.filename)}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div>
                <label
                  htmlFor="head"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  {t`Select head`}
                </label>
                <select
                  id="head"
                  value={seed.head}
                  onChange={(e) => updateSeed('head', e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                >
                  <option value="">All heads</option>
                  {ImageData.images.heads.map((head: any, index: number) => (
                    <option key={index} value={index.toString()}>
                      {formatTraitName(head.filename)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="glasses"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  {t`Select glasses`}
                </label>
                <select
                  id="glasses"
                  value={seed.glasses}
                  onChange={(e) => updateSeed('glasses', e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                >
                  <option value="">All glasses</option>
                  {ImageData.images.glasses.map(
                    (glasses: any, index: number) => (
                      <option key={index} value={index.toString()}>
                        {formatTraitName(glasses.filename)}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="noun-id"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Noun ID
                  </label>
                  <input
                    id="noun-id"
                    name="noun-id"
                    type="text"
                    value={Number(nounId)}
                    placeholder="Noun"
                    readOnly={true}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Price
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="text"
                    value={formatEther(BigInt(price ?? 0))}
                    placeholder="Noun"
                    readOnly={true}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </Drawer.Items>
      </Drawer>
    </>
  )
}

export { AuctionDrawer }

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
