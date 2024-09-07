import { Block } from './types'

interface GraphQLResponse {
  data?: {
    blocks?: Block[]
  }
  errors?: Array<{ message: string }>
}

export async function fetchBlocks(
  subgraphUrl: string,
  offset: number,
): Promise<Block[]> {
  if (!subgraphUrl) {
    throw new Error('Ethereum Blocks Subgraph URL is not configured')
  }

  const queries = Array.from({ length: 10 }, (_, i) => {
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

    const variables = { skip: offset + i * 1000, first: 1000 }

    return fetch(subgraphUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      signal: new AbortController().signal,
    })
      .then(async (response) => {
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
      })
      .catch((error) => {
        if (error instanceof Error && error.name === 'AbortError') {
          console.error('Fetch request timed out')
          throw new Error('Request timed out')
        }
        console.error('Error fetching blocks:', error.message)
        throw new Error('Error fetching blocks')
      })
  })

  // Run all fetch requests concurrently and collect the results
  const results = await Promise.all(queries)

  // Flatten the results into a single array of blocks
  return results.flat()
}
