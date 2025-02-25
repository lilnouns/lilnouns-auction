import { scheduledHandler } from './handlers/scheduled-handler'
import { queueHandler } from './handlers/queue-handler'

export default {
  // The queue handler is invoked when a batch of messages is ready to be delivered
  // https://developers.cloudflare.com/queues/platform/javascript-apis/#messagebatch
  queue: queueHandler,
  // The scheduled handler is invoked at the interval set in our wrangler.jsonc's
  // [[triggers]] configuration.
  scheduled: scheduledHandler,
} satisfies ExportedHandler<Env>
