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

export async function GET(
  request: NextRequest,
  { params: { noun } }: { params: { noun: number } },
) {
  const { env } = getRequestContext()

  const subgraphUrl = env?.ETHEREUM_BLOCKS_SUBGRAPH_URL

  const { searchParams } = request.nextUrl
  const limitParam = searchParams.get('limit') ?? '1000'
  const offsetParam = searchParams.get('offset') ?? '0'

  const limit = Number.parseInt(limitParam, 10)
  const offset = Number.parseInt(offsetParam, 10)

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

  const variables = {
    skip: offset,
    first: limit,
  }

  try {
    // Implementing a timeout for the fetch request (e.g., 10 seconds)
    const controller = new AbortController()
    const timeout = setTimeout(() => {
      controller.abort()
    }, 10_000) // 10,000 ms = 10 seconds

    const response = await fetch(subgraphUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

    if (data.errors && data.errors.length > 0) {
      console.error('GraphQL errors:', data.errors)
      return new Response('Error fetching blocks', { status: 500 })
    }

    if (!data.data?.blocks) {
      console.error('Invalid data structure received:', data)
      return new Response('Invalid data structure received', { status: 500 })
    }

    const blocks: Block[] = data.data.blocks

    // Process seeds concurrently if possible
    const seeds = await Promise.all(
      blocks.map(async (block) => {
        try {
          const seed = getNounSeedFromBlockHash(noun, block.id)
          return {
            blockNumber: block.number,
            seed,
          }
        } catch (seedError) {
          console.error(
            `Error generating seed for block ${block.id}:`,
            seedError,
          )
          return {
            blockNumber: block.number,
            // eslint-disable-next-line unicorn/no-null
            seed: null,
          }
        }
      }),
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
