export async function scheduledHandler(
  controller: ScheduledController,
  env: Env,
  ctx: ExecutionContext,
): Promise<void> {
  // A Cron Trigger can make requests to other endpoints on the Internet,
  // publish to a Queue, query a D1 Database, and much more.
  //
  // We'll keep it simple and make an API call to a Cloudflare API:
  let resp = await fetch('https://api.cloudflare.com/client/v4/ips')
  let wasSuccessful = resp.ok ? 'success' : 'fail'

  // You could store this result in KV, write to a D1 Database, or publish to a Queue.
  // In this template, we'll just log the result:
  console.log(`trigger fired at ${controller.cron}: ${wasSuccessful}`)
}
