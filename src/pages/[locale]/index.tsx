import { LocaleSwitcher, ThemeSwitcher } from '@/components'
import { availableLocales, loadCatalog } from '@/utils'
import { ImageData, getNounData } from '@lilnounsdao/assets'
import { buildSVG } from '@lilnounsdao/sdk'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { GetStaticPropsContext } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'

const { palette } = ImageData

interface SeedData {
  blockNumber: number
  seed: {
    accessory: number
    background: number
    body: number
    glasses: number
    head: number
  }
}

function SVGImage({ svgBase64 }: { svgBase64: string }) {
  return <img src={`data:image/svg+xml;base64,${svgBase64}`} alt="Noun SVG" />
}

export default function Home() {
  const { i18n } = useLingui()
  const [seedsData, setSeedsData] = useState<SeedData[]>([])
  // eslint-disable-next-line unicorn/no-null
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/seeds/8023')
        if (!response.ok) {
          throw new Error('Failed to fetch seed data')
        }
        const data = await response.json()
        setSeedsData(data.seeds)
      } catch (error_) {
        setError(error_.message)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <Head>
        <title>
          {t(i18n)`Next.js & Lingui: Building a Multi-Lingual Website`}
        </title>
      </Head>
      <div
        className={`flex min-h-screen flex-col items-center justify-between p-24`}
      >
        <section className="mt-16 py-8">
          <div className="container">
            <div className="mx-auto max-w-xl">
              <h1 className="mb-4 text-center text-4xl font-bold leading-tight text-gray-900 dark:text-white">
                <Trans>Building a Multi-Lingual Website</Trans>
              </h1>
              <p className="mb-8 text-center text-lg text-gray-600 dark:text-gray-300">
                <Trans>
                  Welcome to our Next.js and Lingui demo site! Discover the
                  power of combining Next.js, a powerful React framework for
                  building server-side rendered applications, with Lingui, the
                  ultimate solution for multi-lingual support in your web
                  projects.
                </Trans>
              </p>
              <div className="mb-4 flex justify-between text-center">
                <ThemeSwitcher className="rounded-full border-2 border-gray-900 p-1 text-gray-900 dark:border-white dark:text-white" />
                <LocaleSwitcher className="rounded-full border-2 border-gray-900 p-1 text-gray-900 dark:border-white dark:text-white" />
              </div>
              {/* Display Noun Seeds */}
              <div>
                {error ? (
                  <div className="text-red-500">Error: {error}</div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {seedsData.map(({ blockNumber, seed }, index) => {
                      const { parts, background } = getNounData(seed)
                      const svgBinary = buildSVG(parts, palette, background) // Pass the correct palette if necessary
                      const svgBase64 = btoa(svgBinary)

                      return (
                        <div
                          key={index}
                          className="rounded border p-4 text-center shadow-sm"
                        >
                          <SVGImage svgBase64={svgBase64} />
                          <div className="mt-2">
                            Block Number: {blockNumber}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export async function getStaticProps(
  context: GetStaticPropsContext<{ locale: string }>,
) {
  return {
    props: { translation: await loadCatalog(context.params!.locale!) },
  }
}

export async function getStaticPaths() {
  return {
    paths: availableLocales.map((locale) => ({ params: { locale } })),
    fallback: false,
  }
}
