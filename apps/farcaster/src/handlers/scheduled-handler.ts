import { formatEther } from 'viem'
import { first, isNullish, round } from 'remeda'
import { client as warpcastClient, createCast } from '@nekofar/warpcast'
import { GraphQLClient } from 'graphql-request'
import { getSdk } from '@/services/lilnouns'

export async function scheduledHandler(
  _controller: ScheduledController,
  env: Env,
  _ctx: ExecutionContext,
): Promise<void> {
  warpcastClient.setConfig({
    auth: () => env.WARPCAST_ACCESS_TOKEN,
  })
  const graphqlClient = new GraphQLClient(env.LILNOUNS_SUBGRAPH_URL)

  // Get previous ID as string and convert to number
  const previousIdStr = await env.KV.get('latest-auction-id')
  const previousId = previousIdStr ? Number(previousIdStr) : null
  console.log(`Latest auction ID from KV: ${previousId}`)

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

    try {
      const nextNoun = auction.noun.id.toString().endsWith('9')
        ? currentId + 3
        : currentId + 1
      const nounPrice = round(
        Number(formatEther(BigInt(auction?.amount ?? 0n))),
        5,
      )
      const castText =
        `Lil Noun #${auction.noun.id} found a new home for ${nounPrice} Ξ! ` +
        `Now auctioning #${nextNoun}; grab yours before someone else does! 👀`
      const embedsUrls = [
        `${env.SITE_BASE_URL}/en/frames/auctions/${auction.id}`,
      ]
      const channelKey = 'lilnouns'
      const { data } = await createCast({
        body: {
          text: castText,
          embeds: embedsUrls,
          channelKey,
        },
      })

      if (!data?.result?.cast) {
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
