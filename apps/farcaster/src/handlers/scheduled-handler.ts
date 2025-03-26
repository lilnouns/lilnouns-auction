import { fetchLatestAuction } from '@/services/lilnouns/fetch-latest-auction'
import { formatEther } from 'viem'
import { cast } from '@/services/warpcast/cast'
import { round } from 'remeda'

export async function scheduledHandler(
  _controller: ScheduledController,
  env: Env,
  _ctx: ExecutionContext,
): Promise<void> {
  // Get previous ID as string and convert to number
  const previousIdStr = await env.KV.get('latest-auction-id')
  const previousId = previousIdStr ? Number(previousIdStr) : null
  console.log(`Latest auction ID from KV: ${previousId}`)

  const auction = await fetchLatestAuction(env.LILNOUNS_SUBGRAPH_URL)
  if (!auction) {
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

    if (!auction.noun) {
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
      const result = await cast(env, castText, embedsUrls, channelKey)

      if (!result.cast) {
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
