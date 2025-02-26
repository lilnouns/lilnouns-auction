import { gql } from 'graphql-request'
import { first } from 'remeda'
import { createClient } from './index'

interface Auction {
  id: string
  noun: {
    id: string
  }
  amount: bigint
  endTime: bigint
  settled: boolean
  bidder: {
    id: string
  }
}

interface CurrentAuctionResponse {
  auctions: Auction[]
}

const query = gql`
  query CurrentAuction {
    auctions(
      where: { settled: false }
      orderBy: endTime
      orderDirection: asc
      first: 1
    ) {
      id
      noun {
        id
      }
      amount
      endTime
      settled
      bidder {
        id
      }
    }
  }
`

export async function fetchCurrentAuction(endpoint: string) {
  const client = createClient(endpoint)
  try {
    const response = await client.request<CurrentAuctionResponse>(query)

    const auction = first(response.auctions)
    if (auction) {
      console.log('Current Auction:', {
        id: auction.id,
        nounId: auction.noun.id,
        amount: auction.amount,
        endTime: auction.endTime,
        bidder: auction.bidder,
      })
    } else {
      console.log('No active auctions found')
    }

    return response
  } catch (error) {
    console.error('Error fetching current auction:', error)
    throw error
  }
}
