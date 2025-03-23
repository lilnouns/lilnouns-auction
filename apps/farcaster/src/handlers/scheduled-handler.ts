import { fetchLatestAuction } from '@/services/lilnouns/fetch-latest-auction'
import { sendDirectCast } from '@/services/warpcast/send-direct-cast'
import { createHash } from 'crypto'

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
    const recipientFid = 17838 // Consider moving to env variables
    const castMessage = `New auction found: ${env.SITE_BASE_URL}/en/frames/auctions/${auction.id}?fv=1`
    const idempotencyKey = createHash('sha256')
      .update(castMessage)
      .digest('hex')
    try {
      const result = await sendDirectCast(
        env,
        recipientFid,
        castMessage,
        idempotencyKey,
      )
      if (!result.success) {
        throw new Error(`Non-successful result: ${JSON.stringify(result)}`)
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
