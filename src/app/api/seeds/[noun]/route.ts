import { getRequestContext } from '@cloudflare/next-on-pages'
import { getNounSeedFromBlockHash } from '@lilnounsdao/assets'
import { type NextRequest } from 'next/server'

export const runtime = 'edge'

interface Block {
  id: string
  number: number
}

interface GraphQLResponse {
  data?: {
    blocks?: Block[]
  }
  errors?: Array<{ message: string }>
}

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

async function fetchBlocks(limit: number, offset: number): Promise<Block[]> {
  const { env } = getRequestContext()
  const subgraphUrl = env?.ETHEREUM_BLOCKS_SUBGRAPH_URL

  if (!subgraphUrl) {
    throw new Error('Ethereum Blocks Subgraph URL is not configured')
  }

  const query = `
    query GetBlocks($skip: Int!, $first: Int!) {
      blocks(
        skip: $skip
        first: $first
        orderBy: number
        orderDirection: desc
      ) {
        id
        number
      }
    }
  `

  const variables = { skip: offset, first: limit }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)

  try {
    const response = await fetch(subgraphUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      console.error(
        `Failed to fetch blocks: ${response.status} ${response.statusText}`,
      )
      throw new Error('Failed to fetch blocks')
    }

    const data: GraphQLResponse = await response.json()

    if (data.errors?.length) {
      console.error('GraphQL errors:', data.errors)
      throw new Error('Error fetching blocks')
    }

    return data.data?.blocks || []
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Fetch request timed out')
        throw new Error('Request timed out')
      }
      console.error('Error fetching blocks:', error.message)
      throw new Error('Error fetching blocks')
    } else {
      console.error('An unknown error occurred:', error)
      throw new Error('Unknown error occurred')
    }
  }
}

export async function GET(
  request: NextRequest,
  { params: { noun } }: { params: { noun: number } },
) {
  const { searchParams } = request.nextUrl
  const limit = Number(searchParams.get('limit') ?? '100')
  let offset = Number(searchParams.get('offset') ?? '0')
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

    while (seedResults.length < limit && moreBlocksAvailable) {
      const blocks = await fetchBlocks(limit, offset)

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
      offset += limit
    }

    return new Response(
      JSON.stringify({ noun, seeds: seedResults.slice(0, limit) }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    if (error instanceof Error && error.message === 'Request timed out') {
      return new Response('Request timed out', { status: 504 })
    }
    return new Response('Internal Server Error', { status: 500 })
  }
}
