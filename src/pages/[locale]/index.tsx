import { availableLocales, loadCatalog } from '@/utils'
import { ImageData, getNounData } from '@lilnounsdao/assets'
import { buildSVG } from '@lilnounsdao/sdk'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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

// Function to render the SVG
const renderSVG = (seed: Seed) => {
  const { parts, background } = getNounData(seed)
  const svgBinary = buildSVG(parts, palette, background)
  return btoa(svgBinary)
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
  const router = useRouter()
  const { nounId } = router.query

  useEffect(() => {
    if (!nounId || Array.isArray(nounId)) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/seeds/${nounId}`)
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

    fetchData()
  }, [nounId])

  return (
    <>
      <Head>
        <title>
          {t(i18n)`Next.js & Lingui: Building a Multi-Lingual Website`}
        </title>
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <section className="p-8">
          <div className="container">
            <div>
              {isLoading ? (
                <div>Loading...</div>
              ) : error ? (
                <div className="text-red-500">Error: {error}</div>
              ) : (
                <div className="grid grid-cols-1 gap-4 text-gray-900 md:grid-cols-2 lg:grid-cols-6 dark:border-white dark:text-white">
                  {seedsData.map(({ blockNumber, seed }) => (
                    <div
                      key={blockNumber}
                      className="rounded border p-4 text-center shadow-sm"
                    >
                      <SVGImage svgBase64={renderSVG(seed)} />
                      <div className="mt-2">Block Number: {blockNumber}</div>
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
    fallback: false, // Revert to false to comply with next-on-pages restrictions
  }
}

export default Home
