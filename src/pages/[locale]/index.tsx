import { availableLocales, loadCatalog } from '@/utils'
import { ImageData, getNounData } from '@lilnounsdao/assets'
import { buildSVG } from '@lilnounsdao/sdk'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import React, { useCallback, useEffect, useState } from 'react'
import { join, map, pipe, split } from 'remeda'
import { useReadContract } from 'wagmi'

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
  <img src={`data:image/svg+xml;base64,${svgBase64}`} alt="Noun SVG" />
)

const Home: React.FC = () => {
  const { i18n } = useLingui()
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
  const [nounId, setNounId] = useState<bigint | undefined>()

  const { data, refetch, isLoading, isError } = useReadContract({
    address: '0xA2587b1e2626904c8575640512b987Bd3d3B592D',
    abi: [
      {
        inputs: [],
        name: 'fetchNextNoun',
        outputs: [
          {
            internalType: 'uint256',
            name: 'nounId',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'uint48',
                name: 'background',
                type: 'uint48',
              },
              {
                internalType: 'uint48',
                name: 'body',
                type: 'uint48',
              },
              {
                internalType: 'uint48',
                name: 'accessory',
                type: 'uint48',
              },
              {
                internalType: 'uint48',
                name: 'head',
                type: 'uint48',
              },
              {
                internalType: 'uint48',
                name: 'glasses',
                type: 'uint48',
              },
            ],
            internalType: 'struct INounsSeeder.Seed',
            name: 'seed',
            type: 'tuple',
          },
          {
            internalType: 'string',
            name: 'svg',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
          {
            internalType: 'bytes32',
            name: 'hash',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'blockNumber',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'fetchNextNoun',
  })

  useEffect(() => {
    if (!isLoading && !isError && data) {
      const [newNounId] = data
      setNounId(newNounId)
    }
  }, [data, isLoading, isError])

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
    refetch()
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
      <Head>
        <title>
          {nounId
            ? t(i18n)`Noun ${nounId} | Lil Nouns Pool`
            : t(i18n)`Lil Nouns Pool`}
        </title>
        <meta
          name="description"
          content={
            nounId
              ? `Explore the seeds of Noun ${nounId}. Discover the power of decentralized creativity.`
              : `This demo site showcases the seamless integration of these powerful tools.`
          }
        />
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-between bg-gray-50 p-1 py-5 dark:bg-gray-900">
        <section className="p-1">
          <div className="container">
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
                <div className="flex h-full items-center justify-center text-gray-700 dark:text-gray-300">
                  Loading...
                </div>
              ) : error ? (
                <div className="text-red-600 dark:text-red-400">
                  Error: {error}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 text-gray-900 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 dark:text-gray-200">
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

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.params?.locale as string | undefined

  if (!locale) {
    return {
      notFound: true,
    }
  }

  return {
    props: { translation: await loadCatalog(locale) },
  }
}

export async function getStaticPaths() {
  return {
    paths: availableLocales.map((locale) => ({ params: { locale } })),
    fallback: false,
  }
}

export default Home
