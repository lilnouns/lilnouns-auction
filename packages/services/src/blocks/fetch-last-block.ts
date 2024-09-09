import { Block, Env } from '@/blocks/types'
import { gql, request } from 'graphql-request'
import { pipe } from 'remeda'

interface GraphQLResponse {
  data?: {
    blocks?: Block[]
  }
  errors?: Array<{ message: string }>
}

/**
 * Fetches the most recent block from the Ethereum Blocks Subgraph.
 *
 * @param env - The environment configuration object, which must contain the
 *   `ETHEREUM_BLOCKS_SUBGRAPH_URL`.
 * @returns A promise that resolves to the most recent block or undefined if no
 *   blocks are found.
 */
export async function fetchLastBlock<T extends Env>(
  env: T,
): Promise<Block | undefined> {
  const { ETHEREUM_BLOCKS_SUBGRAPH_URL: subgraphUrl } = env

  if (!subgraphUrl) {
    throw new Error('Ethereum Blocks Subgraph URL is not configured')
  }

  const query = gql`
    {
      blocks(
        skip: 0
        first: 1
        orderBy: timestamp
        orderDirection: desc
        subgraphError: deny
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

  try {
    const response = await request<GraphQLResponse>(subgraphUrl, query)

    return pipe(response.data?.blocks ?? [], (blocks) =>
      blocks.length > 0 ? blocks[0] : undefined,
    )
  } catch (error) {
    throw error instanceof Error
      ? new Error(`Failed to fetch the last block: ${error.message}`)
      : new Error('An unknown error occurred')
  }
}
