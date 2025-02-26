import { fetchLatestAuction } from '@/services/lilnouns/fetch-latest-auction'

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
  }

  await env.KV.put('latest-auction-id', currentId.toString())
}
