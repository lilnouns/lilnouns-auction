import { fetchLatestAuction } from '@/services/lilnouns/fetch-latest-auction'
import { sendDirectCast } from '@/services/warpcast/send-direct-cast'
import { createHash } from 'crypto'

export async function scheduledHandler(
  _controller: ScheduledController,
  env: Env,
  _ctx: ExecutionContext,
): Promise<void> {
  const previousId = await env.KV.get<number | null>('latest-auction-id')
  console.log(`Latest auction ID from KV: ${previousId}`)

  const auction = await fetchLatestAuction(env.LILNOUNS_SUBGRAPH_URL)
  const currentId = Number(auction?.id)
  console.log(`Latest auction ID from subgraph: ${currentId}`)

  if (previousId && currentId && previousId < currentId) {
    console.log('New auction found!')

    const recipientFid = 17838
    const castMessage = `New auction found: ${auction?.id}`
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
    } catch (error) {
      console.error(error)
    }
  }

  await env.KV.put('latest-auction-id', currentId.toString())
}
