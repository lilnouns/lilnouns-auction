import { fetchLatestAuction } from '@/services/lilnouns/fetch-latest-auction'

export async function scheduledHandler(
  _controller: ScheduledController,
  env: Env,
  _ctx: ExecutionContext,
): Promise<void> {
  const auctionId = await env.KV.get<number | null>('latest-auction-id')
  console.log(`Latest auction ID from KV: ${auctionId}`)

  const auction = await fetchLatestAuction(env.LILNOUNS_SUBGRAPH_URL)
  console.log(auction)

  if (auction?.id && auctionId && auctionId < Number(auction.id)) {
    console.log('New auction found!')
  }

  await env.KV.put('latest-auction-id', auction?.id ?? '')
}
