import { gql, request } from 'graphql-request'
import { pipe } from 'remeda'
import { Auction, Env } from './types'

interface AuctionData {
  auctions?: Auction[]
}

/** @param env */
export async function fetchLastAuction<T extends Env>(
  env: T,
): Promise<Auction | undefined> {
  const { LILNOUNS_SUBGRAPH_URL: subgraphUrl } = env

  if (!subgraphUrl) {
    throw new Error('LilNouns Subgraph URL is not configured')
  }

  const query = gql`
    {
      auctions(
        skip: 0
        first: 1
        orderBy: startTime
        orderDirection: desc
        where: {}
        subgraphError: deny
      ) {
        id
        noun {
          id
        }
        amount
        startTime
        endTime
        settled
      }
    }
  `

  try {
    const data = await request<AuctionData>(subgraphUrl, query)

    return pipe(data?.auctions ?? [], (auctions) =>
      auctions.length > 0 ? auctions[0] : undefined,
    )
  } catch (error) {
    throw error instanceof Error
      ? new Error(`Failed to fetch the last block: ${error.message}`)
      : new Error('An unknown error occurred')
  }
}
