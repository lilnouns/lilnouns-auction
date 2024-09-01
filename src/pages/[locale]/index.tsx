import { availableLocales, loadCatalog } from '@/utils'
import { ImageData, getNounData } from '@lilnounsdao/assets'
import { buildSVG } from '@lilnounsdao/sdk'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import React, { useCallback, useEffect, useState } from 'react'
import { useReadContract } from 'wagmi'

const { palette } = ImageData

// Define the Seed interface
interface Seed {
  accessory: number
  background: number
  body: number
  glasses: number
  head: number
}

// Define the SeedData interface
interface SeedData {
  blockNumber: number
  seed: Seed
}

// Define the API response interface
interface ApiResponse {
  seeds: SeedData[]
}

// SVGImage component to display the SVG
const SVGImage: React.FC<{ svgBase64: string }> = ({ svgBase64 }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={`data:image/svg+xml;base64,${svgBase64}`} alt="Noun SVG" />
)

const Home: React.FC = () => {
  const { i18n } = useLingui()
  const [seedsData, setSeedsData] = useState<SeedData[]>([])
  const [error, setError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedBackground, setSelectedBackground] = useState<
    string | undefined
  >()
  const [selectedBody, setSelectedBody] = useState<string | undefined>()
  const [selectedAccessory, setSelectedAccessory] = useState<
    string | undefined
  >()
  const [selectedHead, setSelectedHead] = useState<string | undefined>()
  const [selectedGlasses, setSelectedGlasses] = useState<string | undefined>()

  const { data } = useReadContract({
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
  const [nounId] = data || []

  // Function to render the SVG, memoized for performance
  const renderSVG = useCallback((seed: Seed) => {
    const { parts, background } = getNounData(seed)
    const svgBinary = buildSVG(parts, palette, background)
    return btoa(svgBinary)
  }, [])

  // Fetch data function
  const fetchData = async () => {
    if (!nounId) return

    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('limit', '12')
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

      // Replace existing seedsData with new data
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

  useEffect(() => {
    fetchData()
  }, [
    nounId,
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
            ? t(
                i18n,
              )`Noun ${nounId} | Building a Multi-Lingual Website with Next.js & Lingui`
            : t(i18n)`Building a Multi-Lingual Website with Next.js & Lingui`}
        </title>
        <meta
          name="description"
          content={
            nounId
              ? `Explore the details and seeds of Noun ${nounId} on our multi-lingual website built with Next.js and Lingui. Discover the power of decentralized creativity.`
              : `Learn how to build a multi-lingual website using Next.js and Lingui. This demo site showcases the seamless integration of these powerful tools.`
          }
        />
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-between bg-gray-50 p-24 dark:bg-gray-900">
        <section className="p-8">
          <div className="container">
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={selectedBackground}
                  onChange={(e) => setSelectedBackground(e.target.value)}
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
                >
                  <option value="">Select Body</option>
                  {ImageData.images.bodies.map((body, index) => (
                    <option key={index} value={index.toString()}>
                      {body.filename}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedAccessory}
                  onChange={(e) => setSelectedAccessory(e.target.value)}
                >
                  <option value="">Select Accessory</option>
                  {ImageData.images.accessories.map((accessory, index) => (
                    <option key={index} value={index.toString()}>
                      {accessory.filename}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedHead}
                  onChange={(e) => setSelectedHead(e.target.value)}
                >
                  <option value="">Select Head</option>
                  {ImageData.images.heads.map((head, index) => (
                    <option key={index} value={index.toString()}>
                      {head.filename}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedGlasses}
                  onChange={(e) => setSelectedGlasses(e.target.value)}
                >
                  <option value="">Select Glasses</option>
                  {ImageData.images.glasses.map((glasses, index) => (
                    <option key={index} value={index.toString()}>
                      {glasses.filename}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              {isLoading ? (
                <div className="flex h-full items-center justify-center text-gray-700 dark:text-gray-300">
                  Loading...
                </div>
              ) : error ? (
                <div className="text-red-600 dark:text-red-400">
                  Error: {error}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 text-gray-900 md:grid-cols-2 lg:grid-cols-6 dark:text-gray-200">
                  {seedsData.map(({ blockNumber, seed }) => (
                    <div
                      key={blockNumber}
                      className="rounded border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    >
                      <SVGImage svgBase64={renderSVG(seed)} />
                      <div className="mt-2 text-gray-700 dark:text-gray-300">
                        Block Number: {blockNumber}
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
    fallback: false, // Revert too false to comply with next-on-pages restrictions
  }
}

export default Home
