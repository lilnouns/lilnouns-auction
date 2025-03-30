import { formatEther } from 'viem'
import { first, isNullish, round } from 'remeda'
import { createCast, getUserByVerificationAddress } from '@nekofar/warpcast'
import { GraphQLClient } from 'graphql-request'
import { getSdk } from '@/services/lilnouns'

export async function scheduledHandler(
  _controller: ScheduledController,
  env: Env,
  _ctx: ExecutionContext,
): Promise<void> {
  // Get previous ID as string and convert to number
  const previousIdStr = await env.KV.get('latest-auction-id')
  const previousId = previousIdStr ? Number(previousIdStr) : null
  console.log(`Latest auction ID from KV: ${previousId}`)

  const graphqlClient = new GraphQLClient(env.LILNOUNS_SUBGRAPH_URL)
  const sdk = getSdk(graphqlClient)
  const { auctions } = await sdk.getLatestAuction()
  const auction = first(auctions)

  if (isNullish(auction)) {
    console.log('No auction data found from subgraph')
    return
  }

  const currentId = Number(auction.id)
  if (isNaN(currentId)) {
    console.error('Invalid auction ID received')
    return
  }

  console.log(`Latest auction ID from subgraph: ${currentId}`)

  if (previousId && currentId > previousId) {
    console.log('New auction found!')

    if (isNullish(auction.noun)) {
      console.error('No noun found in auction')
      return
    }

    if (isNullish(auction.bidder)) {
      console.error('No bidder found in auction')
      return
    }

    try {
      let castText
      const nextNoun = auction.noun.id.toString().endsWith('9')
        ? currentId + 3
        : currentId + 1
      const nounPrice = round(
        Number(formatEther(BigInt(auction?.amount ?? 0n))),
        5,
      )

      const { data: userData } = await getUserByVerificationAddress({
        query: {
          address: auction.bidder?.id,
        },
        auth: () => env.WARPCAST_ACCESS_TOKEN,
      })

      if (!userData?.result?.user) {
        castText =
          `Lil Noun #${auction.noun.id} found a new home for ${nounPrice} Ξ! ` +
          `Now auctioning #${nextNoun}; grab yours before someone else does! 👀`
      } else {
        castText =
          `Lil Noun #${auction.noun.id} found a new home by @${userData?.result?.user.username} for ${nounPrice} Ξ! ` +
          `Now auctioning #${nextNoun}; grab yours before someone else does! 👀`
      }

      const siteBaseUrl = env.SITE_BASE_URL
      const embedsUrls = [`${siteBaseUrl}/en/frames/auctions/${auction.id}`]
      const channelKey = 'lilnouns'
      const { data: castData } = await createCast({
        body: {
          text: castText,
          embeds: embedsUrls,
          channelKey,
        },
      })

      if (!castData?.result?.cast) {
        throw new Error('Failed to create cast')
      }

      // Update KV only when direct cast was successful
      await env.KV.put('latest-auction-id', currentId.toString())
      console.log(`Updated latest auction ID in KV to ${currentId}`)
    } catch (error) {
      console.error('Failed to send direct cast:', error)
      // Consider adding alerting mechanism here
    }
  } else {
    // Still update KV even if no new auction was found
    await env.KV.put('latest-auction-id', currentId.toString())
    console.log(`Updated latest auction ID in KV to ${currentId} (no change)`)
  }
}
