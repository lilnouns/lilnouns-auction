import { Block, BlockData } from '@/types'
import { ClientError, gql, request } from 'graphql-request'
import useSWR from 'swr'
import { useWatchBlockNumber } from 'wagmi'

const fetchBlocks = async (
  offset: number,
  limit: number,
  after?: number,
  before?: number,
): Promise<Block[]> => {
  const subgraphUrl = process.env.NEXT_PUBLIC_BLOCKS_SUBGRAPH_URL ?? ''

  const query = gql`
    query GetBlocks($skip: Int!, $first: Int!, $filter: Block_filter) {
      blocks(
        skip: $skip
        first: $first
        orderBy: number
        orderDirection: desc
        where: $filter
      ) {
        id
        number
        timestamp
      }
    }
  `

  const filter: Record<string, unknown> = {}
  if (after !== null) filter.number_gt = after
  if (before !== null) filter.number_lt = before

  const variables = {
    skip: offset,
    first: limit,
    filter,
  }

  let blocks: Block[] = []
  try {
    const data = await request<BlockData>(subgraphUrl, query, variables)

    blocks = data.blocks ?? []
  } catch (error) {
    // Check if the error is a GraphQL error
    if (
      error instanceof ClientError &&
      error.response &&
      error.response.errors
    ) {
      const graphqlErrors = error.response.errors
        .map((err) => err.message)
        .join(', ')
      throw new Error(`GraphQL Error: ${graphqlErrors}`)
    } else if (error instanceof Error) {
      // Handle network errors or other unexpected errors
      throw new Error(`Network Error: ${error.message}`)
    } else {
      console.error('An unexpected error occurred')
    }
  }

  return blocks
}

export const useBlocks = () => {
  const blockOffset = 0
  const blockLimit = 256

  const { data, error, isValidating, isLoading, mutate } = useSWR(
    ['blocks', blockOffset, blockLimit],
    () => fetchBlocks(blockOffset, blockLimit),
    {
      // Remove refreshInterval
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Do not retry on GraphQL errors
        if (error.message.startsWith('GraphQL Error')) return
        // Retry up to 3 times for network errors
        if (retryCount >= 3) return
        // Retry after 5 seconds
        setTimeout(() => revalidate({ retryCount }), 5000)
      },
    },
  )

  // Watch for new block numbers
  useWatchBlockNumber({
    onBlockNumber: (blockNumber) => {
      console.log('New block detected:', blockNumber)
      // Revalidate the SWR cache when a new block is detected
      mutate()
    },
    onError: (error) => {
      console.error('Error watching block number:', error)
    },
  })

  return {
    data,
    error,
    isValidating,
    isLoading,
  }
}
