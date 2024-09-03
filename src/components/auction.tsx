import { ImageData, getNounData } from '@lilnounsdao/assets'
import { buildSVG } from '@lilnounsdao/sdk'
import React, { useCallback, useEffect, useState } from 'react'
import { join, map, pipe, split } from 'remeda'

const { palette } = ImageData

interface Seed {
  accessory: number
  background: number
  body: number
  glasses: number
  head: number
}

interface SeedData {
  blockNumber: number
  seed: Seed
}

interface ApiResponse {
  seeds: SeedData[]
}

function formatTraitName(traitName: string): string {
  const prefixes = new Set(['head', 'accessory', 'glasses', 'body'])

  return pipe(
    traitName,
    split('-'),
    (parts) => (prefixes.has(parts[0]) ? parts.slice(1) : parts),
    map((part) => part.charAt(0).toUpperCase() + part.slice(1)),
    join(' '),
  )
}

const SVGImage: React.FC<{ svgBase64: string }> = ({ svgBase64 }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={`data:image/svg+xml;base64,${svgBase64}`}
    alt="Noun SVG"
    className="w-full"
  />
)

const SkeletonCard: React.FC = () => (
  <div className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white p-0 text-center shadow dark:border-gray-700 dark:bg-gray-800">
    <div className="flex flex-1 animate-pulse flex-col items-center p-6">
      <div className="size-24 w-full rounded bg-gray-300 dark:bg-gray-700"></div>
      <div className="mt-4 h-4 w-full rounded bg-gray-300 dark:bg-gray-700"></div>
    </div>
    <div className="flex">
      <div className="h-10 w-full rounded-b-lg bg-green-50 dark:bg-green-800"></div>
    </div>
  </div>
)

interface AuctionProps {
  nounId?: bigint | undefined
}

const Auction: React.FC<AuctionProps> = ({ nounId }) => {
  const [seedsData, setSeedsData] = useState<SeedData[]>([])
  const [error, setError] = useState<string | undefined>()
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
  const [selectedBackground, setSelectedBackground] = useState<
    string | undefined
  >()
  const [selectedBody, setSelectedBody] = useState<string | undefined>()
  const [selectedAccessory, setSelectedAccessory] = useState<
    string | undefined
  >()
  const [selectedHead, setSelectedHead] = useState<string | undefined>()
  const [selectedGlasses, setSelectedGlasses] = useState<string | undefined>()
  const [limit, setLimit] = useState<number>(8)
  const [isLimitDisabled, setIsLimitDisabled] = useState<boolean>(false)

  const renderSVG = useCallback((seed: Seed) => {
    const { parts, background } = getNounData(seed)
    const svgBinary = buildSVG(parts, palette, background)
    return btoa(svgBinary)
  }, [])

  const fetchData = async () => {
    if (!nounId) return

    setIsPageLoading(true)
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('limit', limit.toString())
      if (selectedBackground)
        queryParams.append('background', selectedBackground)
      if (selectedBody) queryParams.append('body', selectedBody)
      if (selectedAccessory) queryParams.append('accessory', selectedAccessory)
      if (selectedHead) queryParams.append('head', selectedHead)
      if (selectedGlasses) queryParams.append('glasses', selectedGlasses)

      const response = await fetch(
        `/api/seeds/${nounId}?${queryParams.toString()}`,
      )
      if (!response.ok) {
        throw new Error('Failed to fetch seed data')
      }

      const data: ApiResponse = await response.json()
      setSeedsData(data.seeds)
    } catch (error_) {
      if (error_ instanceof Error) {
        setError(error_.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsPageLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [
    nounId,
    selectedBackground,
    selectedBody,
    selectedAccessory,
    selectedHead,
    selectedGlasses,
    limit,
  ])

  useEffect(() => {
    const selectedValues = [
      selectedBackground,
      selectedBody,
      selectedAccessory,
      selectedHead,
      selectedGlasses,
    ].filter(Boolean)

    if (selectedValues.length > 1) {
      setLimit(1)
      setIsLimitDisabled(true)
    } else {
      setLimit(8)
      setIsLimitDisabled(false)
    }
  }, [
    selectedBackground,
    selectedBody,
    selectedAccessory,
    selectedHead,
    selectedGlasses,
  ])

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between bg-gray-50 p-1 py-5 dark:bg-gray-900">
        <section className="w-full p-1">
          <div className="container mx-auto">
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 shadow-md dark:bg-gray-800">
                <select
                  value={selectedBackground}
                  onChange={(e) => setSelectedBackground(e.target.value)}
                  className="rounded border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-400"
                >
                  <option value="">Select Background</option>
                  {ImageData.bgcolors.map((color, index) => (
                    <option key={index} value={index.toString()}>
                      {color}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedBody}
                  onChange={(e) => setSelectedBody(e.target.value)}
                  className="rounded border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-400"
                >
                  <option value="">Select Body</option>
                  {ImageData.images.bodies.map((body, index) => (
                    <option key={index} value={index.toString()}>
                      {formatTraitName(body.filename)}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedAccessory}
                  onChange={(e) => setSelectedAccessory(e.target.value)}
                  className="rounded border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-400"
                >
                  <option value="">Select Accessory</option>
                  {ImageData.images.accessories.map((accessory, index) => (
                    <option key={index} value={index.toString()}>
                      {formatTraitName(accessory.filename)}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedHead}
                  onChange={(e) => setSelectedHead(e.target.value)}
                  className="rounded border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-400"
                >
                  <option value="">Select Head</option>
                  {ImageData.images.heads.map((head, index) => (
                    <option key={index} value={index.toString()}>
                      {formatTraitName(head.filename)}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedGlasses}
                  onChange={(e) => setSelectedGlasses(e.target.value)}
                  className="rounded border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-400"
                >
                  <option value="">Select Glasses</option>
                  {ImageData.images.glasses.map((glasses, index) => (
                    <option key={index} value={index.toString()}>
                      {formatTraitName(glasses.filename)}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  disabled={isLimitDisabled}
                  placeholder="Limit"
                  className="rounded border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-400"
                />
              </div>
            </div>
            <div>
              {isPageLoading ? (
                <div className="grid grid-cols-1 gap-6 text-gray-900 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 dark:text-gray-200">
                  {Array.from({ length: limit }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </div>
              ) : error ? (
                <div className="text-red-600 dark:text-red-400">
                  Error: {error}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 text-gray-900 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 dark:text-gray-200">
                  {seedsData.map(({ blockNumber, seed }) => (
                    <div
                      key={blockNumber}
                      className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white p-0 text-center shadow dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="flex flex-1 flex-col items-center p-6">
                        <SVGImage svgBase64={renderSVG(seed)} />
                        <div className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                          Block Number: {blockNumber}
                        </div>
                      </div>
                      <div className="flex">
                        <button
                          onClick={() => blockNumber}
                          className="relative inline-flex w-full justify-center rounded-b-lg border border-transparent bg-green-50 py-3 text-sm font-semibold text-gray-900 hover:bg-green-100 dark:bg-green-800 dark:text-gray-200 dark:hover:bg-green-700"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Auction
