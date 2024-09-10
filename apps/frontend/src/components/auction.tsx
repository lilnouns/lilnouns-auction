import { buildSVG } from '@lilnounsdao/sdk'
import { ImageData, getNounData } from '@shared/utilities'
import React, { useCallback, useEffect, useState } from 'react'
import { join, map, pipe, split } from 'remeda'
import { formatEther } from 'viem'
import { useWriteContract } from 'wagmi'

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
  price?: bigint | undefined
}

const Auction: React.FC<AuctionProps> = ({ nounId, price }) => {
  const [seedsData, setSeedsData] = useState<SeedData[]>([])
  const [error, setError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [seedBackground, setSeedBackground] = useState<string | undefined>()
  const [seedBody, setSeedBody] = useState<string | undefined>()
  const [seedAccessory, setSeedAccessory] = useState<string | undefined>()
  const [seedHead, setSeedHead] = useState<string | undefined>()
  const [seedGlasses, setSeedGlasses] = useState<string | undefined>()
  const [limit, setLimit] = useState<number>(8)
  const [cache, setCache] = useState<number>(0)

  const renderSVG = useCallback((seed: Seed) => {
    const { parts, background } = getNounData(seed)
    const svgBinary = buildSVG(parts, palette, background)
    return btoa(svgBinary)
  }, [])

  const fetchData = async () => {
    if (!nounId) return

    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('cache', String(cache))
      queryParams.append('limit', limit.toString())
      if (seedBackground) queryParams.append('background', seedBackground)
      if (seedBody) queryParams.append('body', seedBody)
      if (seedAccessory) queryParams.append('accessory', seedAccessory)
      if (seedHead) queryParams.append('head', seedHead)
      if (seedGlasses) queryParams.append('glasses', seedGlasses)

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
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    fetchData()
  }

  const handleReset = () => {
    setSeedBackground('')
    setSeedBody('')
    setSeedAccessory('')
    setSeedHead('')
    setSeedGlasses('')
    setLimit(8)
  }

  useEffect(() => {
    fetchData()
  }, [nounId])

  useEffect(() => {
    const selectedValues = [
      seedBackground,
      seedBody,
      seedAccessory,
      seedHead,
      seedGlasses,
    ].filter(Boolean)

    if (selectedValues.length > 1) {
      setLimit(1)
    } else {
      setLimit(8)
    }
  }, [seedBackground, seedBody, seedAccessory, seedHead, seedGlasses])

  const { writeContract } = useWriteContract()

  const handleBuy = (blockNumber: number) => {
    writeContract({
      abi: [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'expectedBlockNumber',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'expectedNounId',
              type: 'uint256',
            },
          ],
          name: 'buyNow',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
      ] as const,
      address: '0xA2587b1e2626904c8575640512b987Bd3d3B592D',
      functionName: 'buyNow',
      args: [BigInt(blockNumber), BigInt(nounId ?? 0)],
      value: price,
    })
  }

  // @ts-ignore
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between bg-gray-50 p-1 py-5 dark:bg-gray-900">
        <section className="w-full p-1">
          <div className="container mx-auto">
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 shadow-md dark:bg-gray-800">
                <select
                  value={seedBackground}
                  onChange={(e) => setSeedBackground(e.target.value)}
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
                  value={seedBody}
                  onChange={(e) => setSeedBody(e.target.value)}
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
                  value={seedAccessory}
                  onChange={(e) => setSeedAccessory(e.target.value)}
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
                  value={seedHead}
                  onChange={(e) => setSeedHead(e.target.value)}
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
                  value={seedGlasses}
                  onChange={(e) => setSeedGlasses(e.target.value)}
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
                  min={1}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  placeholder="Limit"
                  className="rounded border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-400"
                />
                <select
                  value={cache}
                  onChange={(e) => setCache(Number(e.target.value))}
                  className="rounded border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-400"
                >
                  <option value="">Select Glasses</option>
                  <option key={0} value={0}>
                    No Cache
                  </option>
                  <option key={1} value={1}>
                    Full Cache
                  </option>
                  <option key={2} value={2}>
                    Block Cache
                  </option>
                </select>
                <span />
                <input
                  type="number"
                  value={Number(nounId)}
                  placeholder="Noun"
                  disabled={true}
                  className="rounded border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-400"
                />
                <input
                  type="number"
                  value={formatEther(BigInt(price ?? 0))}
                  disabled={true}
                  placeholder="Price"
                  className="rounded border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-blue-400"
                />
                <button
                  onClick={handleSearch}
                  className="w-full rounded bg-green-50 py-2 text-sm font-semibold text-gray-900 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-green-800 dark:text-gray-200 dark:hover:bg-green-700"
                >
                  Search
                </button>
                <button
                  onClick={handleReset}
                  className="w-full rounded bg-green-50 py-2 text-sm font-semibold text-gray-900 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-green-800 dark:text-gray-200 dark:hover:bg-green-700"
                >
                  Reset
                </button>
              </div>
            </div>
            <div>
              {isLoading ? (
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
                          onClick={() => handleBuy(blockNumber)}
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
