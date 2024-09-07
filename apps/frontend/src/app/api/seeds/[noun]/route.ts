import { getRequestContext } from '@cloudflare/next-on-pages'
import { getNounSeedFromBlockHash } from '@lilnounsdao/assets'
import { fetchBlocks } from '@shared/services'
import { type NextRequest } from 'next/server'

export const runtime = 'edge'

interface Seed {
  background: number
  body: number
  accessory: number
  head: number
  glasses: number
}

interface SeedResult {
  blockNumber: number
  seed: Seed | undefined
}

export async function GET(
  request: NextRequest,
  { params: { noun } }: { params: { noun: number } },
) {
  const { env } = getRequestContext()
  const subgraphUrl = env?.ETHEREUM_BLOCKS_SUBGRAPH_URL

  const { searchParams } = request.nextUrl
  const seedLimit = Number(searchParams.get('limit') ?? '100')
  let seedOffset = Number(searchParams.get('offset') ?? '0')
  let blockOffset = 0
  let totalFetchedBlocks = 0
  const poolSize = 1_000_000

  try {
    const filterParams: Partial<Seed> = {
      background: searchParams.get('background')
        ? +searchParams.get('background')!
        : undefined,
      body: searchParams.get('body') ? +searchParams.get('body')! : undefined,
      accessory: searchParams.get('accessory')
        ? +searchParams.get('accessory')!
        : undefined,
      head: searchParams.get('head') ? +searchParams.get('head')! : undefined,
      glasses: searchParams.get('glasses')
        ? +searchParams.get('glasses')!
        : undefined,
    }

    let seedResults: SeedResult[] = []
    let moreBlocksAvailable = true

    while (seedResults.length < seedLimit && moreBlocksAvailable) {
      const blocks = await fetchBlocks(subgraphUrl, blockOffset)

      totalFetchedBlocks += blocks.length

      if (blocks.length === 0 || totalFetchedBlocks >= poolSize) {
        moreBlocksAvailable = false
        break
      }

      const newSeedResults = await Promise.all(
        blocks.map(async (block) => {
          try {
            const seed = getNounSeedFromBlockHash(noun, block.id)
            const isMatching = Object.entries(filterParams).every(
              ([key, value]) =>
                value === undefined || seed[key as keyof Seed] === value,
            )

            return isMatching
              ? { blockNumber: block.number, seed }
              : { blockNumber: block.number, seed: undefined }
          } catch (error) {
            if (error instanceof Error) {
              console.error(
                `Error generating seed for block ${block.id}:`,
                error.message,
              )
            } else {
              console.error(
                `An unknown error occurred while generating seed for block ${block.id}:`,
                error,
              )
            }
            return { blockNumber: block.number, seed: undefined }
          }
        }),
      )

      seedResults = [
        ...seedResults,
        ...newSeedResults.filter(
          (result): result is SeedResult => result.seed !== undefined,
        ),
      ]
      blockOffset += 10_000 // Move to the next batch of blocks
    }

    return new Response(
      JSON.stringify({
        noun,
        seeds: seedResults.slice(seedOffset, seedOffset + seedLimit),
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      },
    )
  } catch (error) {
    if (error instanceof Error && error.message === 'Request timed out') {
      return new Response('Request timed out', { status: 504 })
    }
    return new Response('Internal Server Error', { status: 500 })
  }
}
