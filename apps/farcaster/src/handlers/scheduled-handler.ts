import { fetchLatestAuction } from '@/services/lilnouns/fetch-latest-auction'

export async function scheduledHandler(
  controller: ScheduledController,
  env: Env,
  ctx: ExecutionContext,
): Promise<void> {
  await fetchLatestAuction(env.LILNOUNS_SUBGRAPH_URL)
}
