import { getSdk } from './index'
import { first } from 'remeda'
import { GraphQLClient } from 'graphql-request'

export async function fetchCurrentAuction(endpoint: string) {
  const sdk = getSdk(new GraphQLClient(endpoint))
  try {
    const { auctions } = await sdk.currentAuction()

    const auction = first(auctions)
    if (auction) {
      console.log('Current Auction:', {
        id: auction.id,
        nounId: auction.noun?.id,
        amount: auction.amount,
        endTime: auction.endTime,
        bidder: auction.bidder,
      })
    } else {
      console.log('No active auctions found')
    }

    return auction
  } catch (error) {
    console.error('Error fetching current auction:', error)
    throw error
  }
}
