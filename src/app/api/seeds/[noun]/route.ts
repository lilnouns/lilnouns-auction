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

export async function GET(
  request: NextRequest,
  { params: { noun } }: { params: { noun: number } },
) {
  const { env } = getRequestContext()
  const subgraphUrl = env?.ETHEREUM_BLOCKS_SUBGRAPH_URL

  const { searchParams } = request.nextUrl
  const limit = Number(searchParams.get('limit') ?? '100')
  const offset = Number(searchParams.get('offset') ?? '0')

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

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10_000)

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
      return new Response('Failed to fetch blocks', { status: 500 })
    }

    const data: GraphQLResponse = await response.json()

    if (data.errors?.length) {
      console.error('GraphQL errors:', data.errors)
      return new Response('Error fetching blocks', { status: 500 })
    }

    const blocks: Block[] = data.data?.blocks || []

    const filterParams: Partial<Seed> = {
      background: searchParams.get('background')
        ? Number(searchParams.get('background'))
        : undefined,
      body: searchParams.get('body')
        ? Number(searchParams.get('body'))
        : undefined,
      accessory: searchParams.get('accessory')
        ? Number(searchParams.get('accessory'))
        : undefined,
      head: searchParams.get('head')
        ? Number(searchParams.get('head'))
        : undefined,
      glasses: searchParams.get('glasses')
        ? Number(searchParams.get('glasses'))
        : undefined,
    }

    const seedResults = await Promise.all(
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
          console.error(`Error generating seed for block ${block.id}:`, error)
          return { blockNumber: block.number, seed: undefined }
        }
      }),
    )

    const seeds: SeedResult[] = seedResults.filter(
      (result): result is SeedResult => result.seed !== undefined,
    )

    return new Response(JSON.stringify({ noun, seeds }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('Fetch request timed out:', error)
      return new Response('Request timed out', { status: 504 })
    }
    console.error('Error fetching blocks or generating seeds:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
