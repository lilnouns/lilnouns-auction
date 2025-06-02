import { Block, BlockData } from '@/types'
import { ClientError, gql, request } from 'graphql-request'
import useSWR from 'swr'
import { useWatchBlockNumber } from 'wagmi'
import { useCallback, useState } from 'react'

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
  if (after !== undefined) filter.number_gt = after
  if (before !== undefined) filter.number_lte = before

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
  const blockLimit = 256
  const [currentBlockNumber, setCurrentBlockNumber] = useState<bigint | null>(
    null,
  )

  const fetcher = useCallback(async () => {
    if (!currentBlockNumber) return []

    // Fetch blocks from (currentBlock - 256) to currentBlock
    const fromBlock = Number(currentBlockNumber) - blockLimit
    return fetchBlocks(0, blockLimit, fromBlock, Number(currentBlockNumber))
  }, [currentBlockNumber, blockLimit])

  const { data, error, isValidating, isLoading, mutate } = useSWR(
    currentBlockNumber
      ? ['blocks', currentBlockNumber.toString(), blockLimit]
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
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

  // Watch for new block numbers and only update when block changes
  useWatchBlockNumber({
    onBlockNumber: (blockNumber) => {
      // Only update if the block number has actually changed
      if (currentBlockNumber !== blockNumber) {
        console.log(
          'Block number changed:',
          currentBlockNumber,
          '->',
          blockNumber,
        )
        setCurrentBlockNumber(blockNumber)
        // SWR will automatically revalidate due to key change
      }
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
    currentBlockNumber: currentBlockNumber ? Number(currentBlockNumber) : null,
  }
}
