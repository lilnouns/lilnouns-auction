import { scheduledHandler } from './handlers/scheduled-handler'

export default {
  // The scheduled handler is invoked at the interval set in our wrangler.jsonc's
  // [[triggers]] configuration.
  scheduled: scheduledHandler,
} satisfies ExportedHandler<Env>
