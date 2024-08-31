import { availableLocales, loadCatalog } from '@/utils'
import { ImageData, getNounData } from '@lilnounsdao/assets'
import { buildSVG } from '@lilnounsdao/sdk'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

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
  const router = useRouter()
  const nounId = Array.isArray(router.query.nounId)
    ? router.query.nounId[0]
    : router.query.nounId

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

      // Add new seeds to the existing seedsData
      setSeedsData((prevSeeds) => {
        // Filter out any duplicates
        const newSeeds = data.seeds.filter(
          (newSeed) =>
            !prevSeeds.some(
              (existingSeed) =>
                existingSeed.blockNumber === newSeed.blockNumber,
            ),
        )
        return [...prevSeeds, ...newSeeds]
      })
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
                  className="form-select"
                >
                  <option value="">Select Background</option>
                  <option value="1">Background 1</option>
                  <option value="2">Background 2</option>
                  {/* Add more options as needed */}
                </select>
                <select
                  value={selectedBody}
                  onChange={(e) => setSelectedBody(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select Body</option>
                  <option value="1">Body 1</option>
                  <option value="2">Body 2</option>
                  {/* Add more options as needed */}
                </select>
                <select
                  value={selectedAccessory}
                  onChange={(e) => setSelectedAccessory(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select Accessory</option>
                  <option value="1">Accessory 1</option>
                  <option value="2">Accessory 2</option>
                  {/* Add more options as needed */}
                </select>
                <select
                  value={selectedHead}
                  onChange={(e) => setSelectedHead(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select Head</option>
                  <option value="1">Head 1</option>
                  <option value="2">Head 2</option>
                  {/* Add more options as needed */}
                </select>
                <select
                  value={selectedGlasses}
                  onChange={(e) => setSelectedGlasses(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select Glasses</option>
                  <option value="1">Glasses 1</option>
                  <option value="2">Glasses 2</option>
                  {/* Add more options as needed */}
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
