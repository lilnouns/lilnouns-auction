import { gql, request } from 'graphql-request'
import { Block, Env } from './types'

interface BlockData {
  blocks?: Block[]
}

/**
 * Fetches a set of Ethereum blocks from a subgraph defined in the environment.
 *
 * @param env - The environment configuration object containing the subgraph
 *   URL.
 * @param offset - The starting point for fetching blocks.
 * @param [after] - Fetch blocks with number greater than this value (optional).
 * @param [before] - Fetch blocks with number less than this value (optional).
 * @returns A promise that resolves to an array of fetched blocks.
 */
export async function fetchBlocks<T extends Env>(
  env: T,
  offset: number,
  after?: number,
  before?: number,
): Promise<Block[]> {
  const { ETHEREUM_BLOCKS_SUBGRAPH_URL: subgraphUrl } = env

  if (!subgraphUrl) {
    throw new Error('Ethereum Blocks Subgraph URL is not configured')
  }

  const queries = Array.from({ length: 1 }, (_, i) => {
    const query = gql`
      query GetBlocks(
        $skip: Int!
        $first: Int!
        ${after ? '$after: BigInt' : ''}
        ${before ? '$before: BigInt' : ''}
      ) {
        blocks(
          skip: $skip
          first: $first
          orderBy: number
          orderDirection: desc
          where: { ${after ? 'number_gt: $after,' : ''} ${before ? 'number_lt: $before' : ''} }
        ) {
          id
          number
          timestamp
          parentHash
          author
          difficulty
          totalDifficulty
          gasUsed
          gasLimit
          receiptsRoot
          transactionsRoot
          stateRoot
          size
          unclesHash
        }
      }
    `

    const variables = {
      skip: offset + i * 1000,
      first: 1000,
      after,
      before,
    }

    return request<BlockData>(subgraphUrl, query, variables)
      .then((data) => data?.blocks ?? [])
      .catch((error) => {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.error('Fetch request timed out')
            throw new Error('Request timed out')
          }
          console.error('Error fetching blocks:', error.message)
          throw new Error('Error fetching blocks')
        } else {
          console.error('Unknown error occurred during fetch')
          throw new Error('Unknown error occurred')
        }
      })
  })

  // Run all fetch requests concurrently and collect the results
  const results = await Promise.all(queries)

  // Flatten the results into a single array of blocks
  return results.flat()
}
