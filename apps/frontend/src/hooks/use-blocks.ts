import { Block, BlockData } from '@/types'
import { gql, request } from 'graphql-request'
import useSWR from 'swr'

const fetchBlocks = async (
  offset: number,
  limit: number,
  after?: number,
  before?: number,
): Promise<Block[]> => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? globalThis.location.origin
  const subgraphUrl = `${siteUrl}/subgraphs/blocks`

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

  const { blocks } = await request<BlockData>(subgraphUrl, query, variables)

  return blocks ?? []
}

export const useBlocks = () => {
  const blockOffset = 0
  const blockLimit = 256

  const { data, error, isValidating, isLoading } = useSWR(
    ['blocks', blockOffset, blockLimit],
    () => fetchBlocks(blockOffset, blockLimit),
    { refreshInterval: 12000 },
  )

  return {
    data,
    error,
    isValidating,
    isLoading,
  }
}
