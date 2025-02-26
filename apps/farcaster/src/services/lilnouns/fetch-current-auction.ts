import { GetCurrentAuctionQuery, getSdk } from './index'
import { first } from 'remeda'
import { GraphQLClient } from 'graphql-request'

/**
 * Represents a single auction from the GraphQL response
 */
type AuctionResult = NonNullable<GetCurrentAuctionQuery['auctions'][0]>

/**
 * Fetches the current auction data from the specified GraphQL endpoint
 * @param endpoint - The GraphQL API endpoint URL
 * @returns The current auction data or null if no auction is found
 * @throws Will throw an error if the GraphQL request fails
 */
export async function fetchCurrentAuction(
  endpoint: string,
): Promise<AuctionResult | null> {
  try {
    const graphqlClient = new GraphQLClient(endpoint)
    const sdk = getSdk(graphqlClient)
    const { auctions } = await sdk.getCurrentAuction()
    return first(auctions) ?? null
  } catch (error) {
    throw new Error(
      `Failed to fetch current auction: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
