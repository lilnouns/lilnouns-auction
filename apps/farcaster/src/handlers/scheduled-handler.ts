import { fetchCurrentAuction } from '../services/lilnouns/fetch-current-auction'

export async function scheduledHandler(
  controller: ScheduledController,
  env: Env,
  ctx: ExecutionContext,
): Promise<void> {
  await fetchCurrentAuction(env.LILNOUNS_SUBGRAPH_URL)
}
